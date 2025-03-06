import { useCurUserState } from "../../../../../pinia/curUserState.ts";
import { useChannelState } from "../../../../../pinia/ChannelState.ts";
import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";

const SAMPLERATE = 384000;
const SAMPLESIZE = 16;
const BUFFER_SIZE = 4096;
const CHANNELCOUNT = 2;
const InputQuality = {
    // echoCancellation: true, // 启用回声消除
    // noiseSuppression: true, // 启用噪声抑制
    // highpassFilter: true,  // 高通滤波器
};

export class AudioWebRTC {
    private config: any;
    private context: AudioContext;
    private analyser: AnalyserNode;
    private recorder: ScriptProcessorNode;
    private peerConnections: { [key: string]: RTCPeerConnection } = {};
    private localStream: MediaStream | null = null;
    private audioInput: MediaStreamAudioSourceNode | null = null;
    private devicesStore = useDevicesStore();
    private curUserState = useCurUserState();
    private channelState = useChannelState();
    private configuration: any = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10,
        rtcpMuxPolicy: 'require',
    };

    constructor() {
        this.config = {
            constraints: {
                audio: {
                    deviceId: true,
                    channelCount: CHANNELCOUNT,
                    sampleRate: SAMPLERATE,
                    sampleSize: SAMPLESIZE,
                    volume: this.devicesStore.inputVolume,
                    ...InputQuality
                }
            },
            fftSize: BUFFER_SIZE,
            numberChannels: CHANNELCOUNT,
        };

        this.context = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: SAMPLERATE });
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.config.fftSize;

        this.recorder = this.context.createScriptProcessor(BUFFER_SIZE, CHANNELCOUNT, CHANNELCOUNT);

        this.recorder.onaudioprocess = this.onaudioprocess.bind(this);
    }

    async initMediaStream(): Promise<void> {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(this.config.constraints);
            this.devicesStore.mediaStream = this.localStream;

            this.audioInput = this.context.createMediaStreamSource(this.localStream);
            this.audioInput.connect(this.analyser);
            this.analyser.connect(this.recorder);
            this.recorder.connect(this.context.destination);

            // this.audioInput.connect(this.context.destination);
        } catch (error) {
            console.error("获取麦克风音频失败", error);
        }
    }

    private onaudioprocess(e: AudioProcessingEvent): void {
        const inputBuffer = e.inputBuffer;
        const pcmData = new Float32Array(inputBuffer.length * CHANNELCOUNT);

        for (let channel = 0; channel < CHANNELCOUNT; channel++) {
            inputBuffer.copyFromChannel(pcmData.subarray(channel * inputBuffer.length), channel);
        }
    }

    createOffer(userId: string): void {
        const pc = new RTCPeerConnection(this.configuration);
        this.localStream?.getTracks().forEach(track => pc.addTrack(track, this.localStream!));
        console.log('createOffer')
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => window.socket.emit('offer', { offer: pc.localDescription, to: userId }));

        this.peerConnections[userId] = pc;
    }

    startAudioStream(): void {
        this.channelState.roomMember.forEach(user => {
            if (user.id !== this.curUserState.userInfo.id) {
                this.createOffer(user.id);
            }
        });
    }

    receiveAudioStream(): void {
        window.socket.on('offer', async (data) => {
            const pc = new RTCPeerConnection(this.configuration);
            this.localStream?.getTracks().forEach(track => pc.addTrack(track, this.localStream!));

            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            window.socket.emit("answer", { answer: pc.localDescription, to: data.from });

            pc.ontrack = (event) => {
                if (!event.streams[0]) return;
                const source = this.context.createMediaStreamSource(event.streams[0]);
                const gainNode = this.context.createGain();
                gainNode.gain.value = 8;
                source.connect(gainNode);
                gainNode.connect(this.context.destination);
            };

            this.peerConnections[data.from] = pc;
        });
    }

    closeMediaStream(): void {
        this.localStream?.getTracks().forEach(track => track.stop());
        this.devicesStore.mediaStream = null;
        this.localStream = null;
        Object.values(this.peerConnections).forEach(pc => pc.close());
        this.peerConnections = {};
    }
}
