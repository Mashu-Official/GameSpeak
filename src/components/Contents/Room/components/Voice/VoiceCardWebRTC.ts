import { useCurUserState } from "../../../../../pinia/curUserState.ts";
import { useChannelState } from "../../../../../pinia/ChannelState.ts";
import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";
import {audioConnectType} from "./VoiceCardWebsocket.ts";
import {MessageWebSocket} from "./MessageWebsocket.ts";

// 音频应用层 语音业务相关

const SAMPLERATE = 384000;
const SAMPLESIZE = 24;
const BUFFER_SIZE = 4096;
const CHANNELCOUNT = 2;
const InputQuality = {
    // echoCancellation: true, // 启用回声消除
    // noiseSuppression: true, // 启用噪声抑制
    // highpassFilter: true,  // 高通滤波器
};

export class AudioWebRTC {
    private config: any;
    private readonly context: AudioContext;
    private readonly analyser: AnalyserNode;

    private localStream: MediaStream | null = null;

    protected WebSocketSender: MessageWebSocket = new MessageWebSocket();  // 信令发送

    private audioInput: MediaStreamAudioSourceNode | null = null;
    protected workletNode: AudioWorkletNode[] = [];

    private devicesStore = useDevicesStore();
    private curUserState = useCurUserState();
    private channelState = useChannelState();

    public userAudioNodeMap = new Map()

    private configuration: any = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10,
        rtcpMuxPolicy: 'require',
    }

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

        this.WebSocketSender.callback = this.playRemoteStream.bind(this)
    }

    async initMediaStream(): Promise<void> {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(this.config.constraints);

            this.audioInput = this.context.createMediaStreamSource(this.localStream);  // 测试用的 本地流

            this.audioInput.connect(this.analyser);

            // 加载 AudioWorkletProcessor 模块
            await this.context.audioWorklet.addModule("/pcm-processor.js");
            // 创建 AudioWorkletNode
            this.workletNode.push(new AudioWorkletNode(this.context, "pcm-processor"))

            // // 连接音频流到 AudioWorkletNode
            // this.audioInput.connect(this.analyser);
            // this.analyser.connect(this.workletNode);
            // this.audioInput.connect(this.context.destination);
        } catch (error) {
            console.error("获取麦克风音频失败", error);
        }
    }

    processLocalAudioStreamSetting(){
        // 创建 AudioBufferSourceNode 播放音频
    }

    playRemoteStream(userId: string, remoteStream: MediaStream) {
        console.log(`🎧 收到用户 ${userId} 的音频流`, remoteStream);
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = remoteStream;
        remoteAudio.autoplay = true;
        remoteAudio.volume = 1;  // 设置音量
        this.userAudioNodeMap.set(userId, remoteAudio);
        document.body.appendChild(remoteAudio);
    }


    async startCall() {
        try {
            if (!this.localStream) {
                await this.initMediaStream(); // 确保本地流已经初始化
            }

            // 监听远程用户的音频流
            this.channelState.InRoomMember.forEach((user)=>{
                this.WebSocketSender.createPeerConnection(user.socketID);
            })

            // 发送 WebRTC Offer，启动呼叫
            if (this.localStream) {
                await this.WebSocketSender.startCall(this.localStream);
            } else {
                setTimeout(() => {
                    this.initMediaStream();
                    this.startCall();
                }, 300);
            }
        } catch (error) {
            console.error("🚨 无法获取本地媒体流：", error);
        }
    }

}
