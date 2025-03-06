import { useDevicesStore } from "../../../../../../pinia/deviceStore.ts";
import PCMPlayer from "pcm-player";
import {AudioWebSocket, audioPackage} from "../AudioWebSocket.ts";

const SAMPLERATE = 384000; // 采样率
const SAMPLESIZE = 16 // 音频位数
const BUFFER_SIZE = 4096; // ScriptProcessorNode 缓冲大小 确保是 256、512、1024、2048、4096、8192、16384 之一
const CHANNELCOUNT = 2  // 声道数
const InputQuality = {
    // echoCancellation: true, // 启用回声消除
    // noiseSuppression: true, // 启用噪声抑制
    // highpassFilter: true,  // 高通滤波器
}


export class PcmRecorder {
    private config: any;
    private context: AudioContext;
    private readonly analyser: AnalyserNode;
    private readonly recorder: ScriptProcessorNode;
    public audioInput: MediaStreamAudioSourceNode | null = null;
    protected audioStream: MediaStream | null = null;
    private audioWebSocket: AudioWebSocket | null = null;
    public isWebsocketOrWebRTC_mode: audioConnectType;
    public player: PCMPlayer;

    constructor(isWebsocketOrWebRTC_mode = audioConnectType.websocket) {
        this.config = {
            constraints: {
                audio: {
                    deviceId: true,
                    channelCount: CHANNELCOUNT,
                    sampleRate: SAMPLERATE,
                    sampleSize: SAMPLESIZE,
                    volume: useDevicesStore().inputVolume,
                    ...InputQuality  // 降噪相关
                },
            },
            fftSize: BUFFER_SIZE,
            numberChannels: 2,
        };

        this.context = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: SAMPLERATE, // ✅ 显式设置
        });

        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.config.fftSize;

        // ✅ 修正 PCM 播放器参数
        // @ts-ignore
        this.player = new PCMPlayer({
            // inputCodec: "Float32",
            inputCodec: "Int16",
            channels: CHANNELCOUNT,
            sampleRate: SAMPLERATE,
            flushTime: 10,
        });
        this.player.volume(5)

        // ✅ 修正缓冲大小
        this.recorder = this.context.createScriptProcessor(
            BUFFER_SIZE,
            this.config.numberChannels,
            this.config.numberChannels
        );
        this.recorder.onaudioprocess = this.onaudioprocess.bind(this);
        this.isWebsocketOrWebRTC_mode = isWebsocketOrWebRTC_mode;

        if (this.isWebsocketOrWebRTC_mode === audioConnectType.websocket) {
            this.audioWebSocket = new AudioWebSocket();
        }
    }

    // ✅ 修正音频流初始化
    async init(): Promise<void> {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia(this.config.constraints);
            useDevicesStore().mediaStream = this.audioStream;

            this.audioInput = this.context.createMediaStreamSource(this.audioStream);
            this.audioInput.connect(this.analyser);
            this.analyser.connect(this.recorder);
            this.recorder.connect(this.context.destination);
            // 直接播放
            this.audioInput.connect(this.context.destination);
        } catch (error) {
            console.error("获取麦克风音频失败", error);
        }
    }

    // ✅ 修正 `onaudioprocess`
    private onaudioprocess(e: AudioProcessingEvent): void {
        const inputBuffer = e.inputBuffer;
        const numChannels = inputBuffer.numberOfChannels;
        const float32Data = new Float32Array(inputBuffer.length * numChannels);
        const int16Data = new Int16Array(inputBuffer.length * numChannels);

        // for (let channel = 0; channel < numChannels; channel++) {
        //     inputBuffer.copyFromChannel(float32Data.subarray(channel * inputBuffer.length), channel);
        // }
        //
        // // 将 Float32 PCM 数据转换为 Int16 PCM 数据
        // for (let i = 0; i < float32Data.length; i++) {
        //     int16Data[i] = Math.max(-32768, Math.min(32767, float32Data[i] * 32768));
        // }
        // console.log("Int16 PCM Data:", int16Data);

        // const pcmData = new Float32Array(inputBuffer.length * numChannels);
        //
        // for (let channel = 0; channel < numChannels; channel++) {
        //     inputBuffer.copyFromChannel(pcmData.subarray(channel * inputBuffer.length), channel);
        // }

        const pcmData = int16Data
        console.log("PCM Data:", pcmData);
        // this.player.feed(pcmData);
        console.log("发送的数据",pcmData)
        // this.audioWebSocket?.sendAudioBuffer(pcmData);
    }

    public onReceiveAudioBuffer() {
        this.audioWebSocket?.receiveAudioBuffer(async (userID: string, pcmData: ArrayBuffer) => {
            this.playAudioForUser(userID, pcmData);

            console.log("接收到音频数据:", pcmData);
        });
    }

    playAudioForUser(userID: string, audioBuffer: AudioBuffer): void {
        this.player.feed(audioBuffer);
    }

    // playAudioForUser(userID: string, audioBuffer: AudioBuffer): void {
    //     const audioSource = this.context.createBufferSource(); // 创建音频源
    //     audioSource.buffer = audioBuffer; // 绑定音频数据
    //     audioSource.connect(this.context.destination); // 连接到扬声器
    //
    //     // 确保和录制时的参数一致
    //     console.log(`正在播放来自用户 ${userID} 的音频`);
    //     console.log(`采样率: ${audioBuffer.sampleRate}, 通道数: ${audioBuffer.numberOfChannels}`);
    //
    //     audioSource.start(); // 播放
    // }
}

export enum audioConnectType {
    websocket = "websocket",
    webrtc = "webrtc",
}


