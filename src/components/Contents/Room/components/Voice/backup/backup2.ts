import { ref } from 'vue';
import { useCurUserState } from "../../../../../../pinia/curUserState.ts";
import { useChannelState } from "../../../../../../pinia/ChannelState.ts";
import { useDevicesStore } from "../../../../../../pinia/deviceStore.ts";

// 音频 WebRTC 相关功能
export const useAudioWebRTC = () => {
    const curUserState = useCurUserState();
    const channelState = useChannelState();
    const devicesStore = useDevicesStore();

    const peerConnections = ref<{ [key: string]: RTCPeerConnection }>({}); // 存储每个用户的 peer connection
    const localStream = ref<MediaStream | null>(null); // 本地音频流

    // 音频设备约束
    const constraints: MediaStreamConstraints = {
        audio: {
            deviceId: devicesStore.audioInput?.deviceId ? { exact: devicesStore.audioInput.deviceId } : true,
            channelCount: 2,
            volume: devicesStore.inputVolume * 0.01,
            sampleRate: 384000,  // 采样率
            sampleSize: 24,
            autoGainControl: true, // 启用自动增益控制
            // echoCancellation: true, // 启用回声消除
            // noiseSuppression: true, // 启用噪声抑制
            // highpassFilter: true,  // 高通滤波器
        },
    };

    // WebRTC 配置，包括多个 STUN 服务器
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            // 可以根据需要添加更多 STUN/TURN 服务器
        ],
        iceCandidatePoolSize: 10, // 提高候选池大小
        rtcpMuxPolicy: 'require',  // 强制使用 RTP 多路复用，减少 RTP 流的延迟
    };

    const config = {
        constraints,
        fftSize: 512
    }
    const audioByteRate: number = devicesStore.audioByteRate   // 音频流的上传码率


    const audioInput = ref()
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // 创建音频上下文
    const analyser = audioContext.createAnalyser(); // 创建音频分析器
    analyser.fftSize = config.fftSize;  // 频率变换大小

    const recorder = audioContext.createScriptProcessor(config.fftSize, config.constraints.audio.channelCount, config.constraints.audio.channelCount);
    // recorder.onaudioprocess = onaudioprocess.bind(this);

    // 用于缓存音频数据
    const audioBufferQueue = []; // 存储音频数据的缓冲区
    const previousBuffer = null; // 上一个音频缓冲区，用于交叉淡入淡出

    const varBridge = {}

    // 初始化本地媒体流
    const initMediaStream = async () => {
        try {
            devicesStore.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            audioInput.value = audioContext.createMediaStreamSource(devicesStore.mediaStream)   // 媒体流做完声音源
            analyser.connect(recorder);
            recorder.connect(audioContext.destination);
            // localStream.value = devicesStore.mediaStream; // 保留本地流的引用
            // 将流传递到audioPlayer
            const audioPlayer = document.getElementById('audioPlayer');

            // @ts-ignore
            audioPlayer.srcObject = devicesStore.mediaStream; // 实时播放

        } catch (error) {
            console.error('获取麦克风音频失败', error);
        }
    };


    onaudioprocess(e) {
        const data = e.inputBuffer.getChannelData(0); // 采集单通道音频数据

        // 将音频数据加入缓冲区
        this.audioBufferQueue.push(new Float32Array(data));

        // 如果缓冲区数据大于一定大小，则处理并播放音频
        if (this.audioBufferQueue.length * this.config.fftSize >= this.config.fftSize) {
            this.handlePcm();
        }
    }



    // 创建 WebRTC offer 并发送音频流
    const createOffer = (userId: string) => {
        const pc = new RTCPeerConnection(configuration);

        // 添加本地音频流到 WebRTC 连接
        if (devicesStore.mediaStream) {
            devicesStore.mediaStream.getTracks().forEach(track => pc.addTrack(track, devicesStore.mediaStream));
        }

        // 调整音频轨道的比特率（例如设置最大比特率）
        pc.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'audio') {
                const params = sender.getParameters();
                params.encodings[0].maxBitrate = audioByteRate; // 设置音频比特率
                sender.setParameters(params);
            }
        });

        // 创建 offer
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => window.socket.emit('offer', { offer: pc.localDescription, to: userId }));

        peerConnections.value[userId] = pc;
    };

    // 向其他房间成员发送音频流（发起音频流）
    const startAudioStream = () => {
        for (const user of channelState.roomMember) {
            if (user.id !== curUserState.userInfo.id) {
                createOffer(user.id);
            }
        }
    };

    // 接收音频流
    const receiveAudioStream = () => {
        // 监听从其他用户发来的 offer
        window.socket.on('offer', async (data) => {
            const pc = new RTCPeerConnection(configuration);

            // 添加本地音频流到 WebRTC 连接
            if (devicesStore.mediaStream) {
                devicesStore.mediaStream.getTracks().forEach(track => pc.addTrack(track, devicesStore.mediaStream));
            }

            // 设置远程描述并创建 answer
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            window.socket.emit("answer", { answer: pc.localDescription, to: data.from });

            // 处理音频流
            pc.ontrack = (event) => {
                const remoteAudio = document.getElementById(`remote-audio-${data.from}`) as HTMLAudioElement;
                if (remoteAudio.srcObject !== event.streams[0]) {
                    remoteAudio.srcObject = event.streams[0];
                }
            };

            peerConnections.value[data.from] = pc;
        });

        // 监听来自其他用户的 answer
        window.socket.on('answer', (data) => {
            const pc = peerConnections.value[data.from];
            pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        // 监听 ICE 候选信息
        window.socket.on('candidate', (data) => {
            const pc = peerConnections.value[data.from];
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        });
    };

    // 监听 ICE 连接状态变化（网络连接质量监控）
    const onIceConnectionStateChange = () => {
        for (const pc of Object.values(peerConnections.value)) {
            pc.oniceconnectionstatechange = () => {
                const state = pc.iceConnectionState;
                if (state === 'failed' || state === 'disconnected') {
                    console.error(`ICE 连接失败：${state}`);
                }
            };
        }
    };

    // 关闭本地流并停止 WebRTC 连接
    const closeMediaStream = () => {
        if (localStream.value) {
            // 停止本地流的所有轨道
            localStream.value.getTracks().forEach(track => track.stop());
            devicesStore.mediaStream = null; // 清空媒体流引用
            localStream.value = null; // 清空本地流
        }

        // 关闭所有的 peer connection
        Object.values(peerConnections.value).forEach(pc => {
            pc.close(); // 关闭 WebRTC 连接
        });

        peerConnections.value = {}; // 清空 peerConnections 引用
    };

    return {
        peerConnections,
        localStream,
        startAudioStream,  // 启动音频流发送
        receiveAudioStream,  // 启动音频流接收
        initMediaStream, // 初始化本地音频流
        onIceConnectionStateChange, // 监听 ICE 状态变化
        closeMediaStream, // 关闭流和 WebRTC 连接
    };
};


import {reactive, ref} from 'vue';
import {useDevicesStore} from "../../../../../../pinia/deviceStore.ts";
import { Socket } from "socket.io-client";
import {useCurUserState} from "../../../../../../pinia/curUserState.ts";
export enum audioConnectType {
    websocket = 'websocket',
    webrtc = 'webrtc'
}
// 音频处理类
export class PcmRecorder {
    // 配置对象，用于存储录音的相关参数
    private config: any;
    // 创建音频上下文（AudioContext）对象，用于管理音频资源的处理与控制
    private context: AudioContext;
    // 创建音频分析器（AnalyserNode），用于实时分析音频数据的频率等信息
    private readonly analyser: AnalyserNode;
    // 创建脚本处理节点（是ScriptProcessorNode AudioWorklet实在不搞不明白），用于通过JavaScript实时处理音频流数据
    private readonly recorder: ScriptProcessorNode;
    // 用于存储录制的音频数据，以便后续处理
    private audioBufferQueue: Float32Array[] = [];
    // 保存上一个音频缓冲区，用于交叉淡入淡出
    private previousBuffer: AudioBuffer | null = null;
    // 音频输入节点，将MediaStream连接到AudioContext以便进行音频处理
    public audioInput: MediaStreamAudioSourceNode | null = null;

    protected audioStream: MediaStream;
    private audioWebSocket: AudioWebSocket;

    public isWebsocketOrWebRTC_mode: audioConnectType;

    constructor(isWebsocketOrWebRTC_mode= audioConnectType['websocket']) {
        this.config = {
            constraints: {
                audio: {
                    deviceId: true,     //设备ID
                    channelCount: 2,  // 双声道
                    // volume: 0.05,       // 输入音量
                    sampleRate: 9600000,  // 采样率 单位是HZ
                    sampleSize: 24,   // 音频位数
                    // echoCancellation: true, // 启用回声消除
                    // noiseSuppression: true, // 启用噪声抑制
                    // highpassFilter: true,  // 高通滤波器
                },
            },
            fftSize: 512,
            numberChannels: 2,
        }
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.config.fftSize;

        // 创建一个ScriptProcessorNode连接到AudioContext
        this.recorder = this.context.createScriptProcessor(this.config.fftSize, this.config.numberChannels, this.config.numberChannels);
        this.recorder.onaudioprocess = this.onaudioprocess.bind(this);
        this.isWebsocketOrWebRTC_mode = isWebsocketOrWebRTC_mode

        if(this.isWebsocketOrWebRTC_mode === audioConnectType["websocket"]){
            this.audioWebSocket = new AudioWebSocket()
        }
        else if(this.isWebsocketOrWebRTC_mode === audioConnectType["webrtc"]){

        }
    }

    // 初始化音频流并关联到AudioContext
    async init(): Promise<void> {
        try {
            // 获取媒体流
            this.audioStream = await navigator.mediaDevices.getUserMedia(this.config.constraints);
            useDevicesStore().mediaStream = this.audioStream
            // 处理音频流
            this.audioInput = this.context.createMediaStreamSource(this.audioStream);
            this.audioInput.connect(this.analyser);
            this.analyser.connect(this.recorder);
            this.recorder.connect(this.context.destination);

            // 将流传递到audioPlayer进行实时播放 测试语句
            const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
            audioPlayer.srcObject = this.audioStream;
        } catch (error) {
            console.error('获取麦克风音频失败', error);
        }
    }


    // 处理音频数据
    private onaudioprocess(e: AudioProcessingEvent): void {
        const data = e.inputBuffer.getChannelData(0); // 采集单通道音频数据

        // 将音频数据加入缓冲区
        this.audioBufferQueue.push(new Float32Array(data));

        // 如果缓冲区数据大于一定大小，则处理并播放音频
        if (this.audioBufferQueue.length * this.config.fftSize >= this.config.fftSize) {

            this.handlePcm((audioBuffer)=>{
                // 通过websocket发送
                this.audioWebSocket.sendAudioBuffer(audioBuffer)

                // 通过webrtc连接发送

            });

        }
    }

    public onReceiveAudioBuffer(){
        this.audioWebSocket.receiveAudioBuffer()
        // this.mergeAudioBuffers
    }

    // 实时播放处理过的音频数据
    private handlePcm(callback:Function): void {
        const totalLength = this.audioBufferQueue.reduce((sum, buffer) => sum + buffer.length, 0);
        const audioBuffer = this.context.createBuffer(1, totalLength, this.context.sampleRate);

        let offset = 0;
        for (const buffer of this.audioBufferQueue) {
            audioBuffer.getChannelData(0).set(buffer, offset);
            offset += buffer.length;
        }

        // 清空缓冲区
        this.audioBufferQueue = [];

        callback(audioBuffer)

        // 如果存在上一个音频缓冲区，进行交叉淡入淡出
        if (this.previousBuffer) {
            this.applyCrossfade(this.previousBuffer, audioBuffer);
        }

        // 保存当前音频缓冲区作为下次交叉淡入淡出的基准
        this.previousBuffer = audioBuffer;

        // 创建一个AudioBufferSourceNode来播放音频
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;

        // 在当前时间稍微延迟播放（减少延迟带来的影响）
        const currentTime = this.context.currentTime;
        source.start(currentTime + 0.1); // 延迟播放0.05秒（根据需要调整）

        source.connect(this.context.destination); // 连接到输出
    }

    protected usePcmProcess(AudioBuffer:AudioBuffer):void{
        console.log(AudioBuffer)
    }
    // 交叉淡入/淡出处理
    private applyCrossfade(previousBuffer: AudioBuffer, currentBuffer: AudioBuffer): void {
        const fadeDuration = 0.1; // 交叉淡入淡出的时间（秒）
        const fadeSampleCount = Math.floor(fadeDuration * this.context.sampleRate);
        const prevData = previousBuffer.getChannelData(0);
        const currData = currentBuffer.getChannelData(0);

        // 淡入：逐渐增加当前音频的音量
        this.fadeIn(currData, fadeSampleCount);

        // 淡出：逐渐减少上一个音频的音量
        this.fadeOut(prevData, fadeSampleCount);
    }

    // 淡入处理
    private fadeIn(data: Float32Array, fadeSampleCount: number): void {
        for (let i = 0; i < fadeSampleCount; i++) {
            const fadeInFactor = i / fadeSampleCount;
            data[i] *= fadeInFactor;
        }
    }

    // 淡出处理
    private fadeOut(data: Float32Array, fadeSampleCount: number): void {
        for (let i = 0; i < fadeSampleCount; i++) {
            const fadeOutFactor = 1 - (i / fadeSampleCount);
            data[data.length - fadeSampleCount + i] *= fadeOutFactor;
        }
    }

    // 合并音频流
    private mergeAudioBuffers(buffers: AudioBuffer[]): AudioBuffer {
        const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
        const mergedBuffer = this.context.createBuffer(1, totalLength, this.context.sampleRate);

        let offset = 0;
        buffers.forEach(buffer => {
            mergedBuffer.getChannelData(0).set(buffer.getChannelData(0), offset);
            offset += buffer.length;
        });

        return mergedBuffer;
    }

}



export class AudioWebSocket {
    // private socket: Socket;
    private audioPackageList: Map<string, AudioBuffer[]> = new Map(); // 使用 Map 存储每个用户的音频数据

    constructor() {
        // this.socket = window.socket;
    }

    // 发送音频缓冲区
    sendAudioBuffer(audioBuffer: AudioBuffer): void {
        // 使用 Socket 发送音频缓冲区数据
        window.socket.emit("startAudioStream", {
            userID: useCurUserState().userInfo.id,
            audioBuffer: audioBuffer.getChannelData(0),
        });
    }

    // 接收音频缓冲区并播放
    receiveAudioBuffer(callback:Function): void {

        window.socket.on('receiveAudioStream', (audioPackage: audioPackage) => {
            // 预处理 根据userID 分开不同的audioBuffer再合并
            const userID = audioPackage.userID;
            const audioBufferData = audioPackage.audioBuffer;

            // 检查是否已经存储过该用户的音频数据
            if (!this.audioPackageList.has(userID)) {
                this.audioPackageList.set(userID, []);
            }
            // 将新的音频数据加入到对应用户的音频数据列表中
            this.audioPackageList.get(userID)?.push(audioBufferData);
            console.log(this.audioPackageList)
            // 下边这个回调就是合并
            callback(audioPackage)
            // console.log(audioPackage)
        });
    }
}

interface audioPackage {
    userID: string,
    audioBuffer: AudioBuffer,
}