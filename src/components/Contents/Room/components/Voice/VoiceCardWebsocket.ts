import {useDevicesStore} from "../../../../../pinia/deviceStore.ts";
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import PCMPlayer from 'pcm-player'


const SAMPLERATE = 768000

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

    // 音频输入节点，将MediaStream连接到AudioContext以便进行音频处理
    public audioInput: MediaStreamAudioSourceNode | null = null;

    protected audioStream: MediaStream | null = null;
    private audioWebSocket: AudioWebSocket | null = null;

    public isWebsocketOrWebRTC_mode: audioConnectType;

    public player: PCMPlayer

    // private audioMap = new Map()
    constructor(isWebsocketOrWebRTC_mode = audioConnectType['websocket']) {
        this.config = {
            constraints: {
                audio: {
                    deviceId: true,     //设备ID
                    channelCount: 2,  // 双声道
                    // volume: 0.05,       // 输入音量
                    sampleRate: SAMPLERATE,  // 采样率 单位是HZ
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
        // @ts-ignore
        this.player = new PCMPlayer({
            inputCodec: 'Float32',
            channels: 2,
            sampleRate: SAMPLERATE,
            flushTime: 200
        })

        // 创建一个ScriptProcessorNode连接到AudioContext
        this.recorder = this.context.createScriptProcessor(this.config.fftSize, this.config.numberChannels, this.config.numberChannels);
        this.recorder.onaudioprocess = this.onaudioprocess.bind(this);
        this.isWebsocketOrWebRTC_mode = isWebsocketOrWebRTC_mode

        if (this.isWebsocketOrWebRTC_mode === audioConnectType["websocket"]) {
            // 实例化 ws发送器
            this.audioWebSocket = new AudioWebSocket()
        } else if (this.isWebsocketOrWebRTC_mode === audioConnectType["webrtc"]) {

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

            // 直接播放
            // this.audioInput.connect(this.context.destination);
        } catch (error) {
            console.error('获取麦克风音频失败', error);
        }
    }

    // 处理音频数据
    private onaudioprocess(e: AudioProcessingEvent): void {
        const pcmData = e.inputBuffer.getChannelData(0); // 采集单通道音频数据

        this.audioWebSocket.sendAudioBuffer(pcmData)
    }

    public onReceiveAudioBuffer() {
        this.audioWebSocket.receiveAudioBuffer(async (userID: string, pcmData: ArrayBuffer) => {
            this.playAudioForUser(userID, pcmData); // 播放音频
            // 直接播放该音频，不等待其他音频
            console.log("数据:", pcmData)
        })
    }
    playAudioForUser(userID: string, audioBuffer: AudioBuffer): void {
        // @ts-ignore
        this.player.feed(audioBuffer)
    }

}


export class AudioWebSocket {
    // private audioPackageList: Map<string, AudioBuffer[]> = new Map(); // 使用 Map 存储每个用户的音频数据
    // 创建音频上下文（AudioContext）对象，用于管理音频资源的处理与控制
    private context: AudioContext;

    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    // 发送音频
    sendAudioBuffer(pcmData: ArrayBuffer): void {
        const pcmArrayBuffer = pcmData.buffer; // 转换为 ArrayBuffer

        // 使用 Socket 发送音频缓冲区数据
        window.socket.emit("startAudioStream", {
            userID: useCurUserState().userInfo.id,
            audioBuffer: pcmArrayBuffer,
        });
    }


    // 接收音频并播放
    receiveAudioBuffer(handleAudioBuffer: Function): void {
        const audioContext = new AudioContext();

        window.socket.on('receiveAudioStream', async (audioPackage: audioPackage) => {
            const userID = audioPackage.userID;
            const pcmData = audioPackage.audioBuffer; // 这里假设接收到的是 PCM 数据
            handleAudioBuffer(userID, pcmData)
        });
    }

}

interface audioPackage {
    userID: string,
    audioBuffer: AudioBuffer,
}