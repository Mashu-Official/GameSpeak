import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";
import PCMPlayer from "pcm-player";
import {AudioWebSocket, audioPackage} from "./AudioWebSocket.ts";

const SAMPLERATE = 192000; // 采样率 768000
const SAMPLESIZE = 24 // 音频位数
const CHANNELCOUNT = 2  // 声道数
const InputQuality = {
    autoGainControl:false,
    // echoCancellation: true, // 启用回声消除
    // noiseSuppression: true, // 启用噪声抑制
    // highpassFilter: true,  // 高通滤波器
}
console.log()

export class PcmRecorder {
    private readonly context: AudioContext;
    private readonly analyser: AnalyserNode;
    private workletNode: AudioWorkletNode | null = null;
    private audioInput: MediaStreamAudioSourceNode | null = null;
    protected audioStream: MediaStream | null = null;
    private audioWebSocket: AudioWebSocket | null = null;
    public isWebsocketOrWebRTC_mode: audioConnectType;
    // @ts-ignore
    public player: PCMPlayer = new PCMPlayer({
        inputCodec: "Float32",
        channels: CHANNELCOUNT,
        sampleRate: SAMPLERATE,
        flushTime: 10,
    });
    private config: object = {
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
        numberChannels: CHANNELCOUNT,
    };

    constructor(isWebsocketOrWebRTC_mode = audioConnectType.websocket) {
        // 只在构造函数中初始化 AudioContext
        this.context = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: SAMPLERATE,
        });
        this.analyser = this.context.createAnalyser();
        this.isWebsocketOrWebRTC_mode = isWebsocketOrWebRTC_mode;

        if (this.isWebsocketOrWebRTC_mode === audioConnectType.websocket) {
            this.audioWebSocket = new AudioWebSocket();
        }
    }

    // ✅ 只用 AudioWorklet 处理音频
    async init_WebSocketMode(): Promise<void> {
        try {
            // 加载 AudioWorkletProcessor 模块
            await this.context.audioWorklet.addModule("/pcm-processor.js");

            // 获取用户的音频流
            this.audioStream = await navigator.mediaDevices.getUserMedia(this.config.constraints);
            // 创建音频输入节点
            this.audioInput = this.context.createMediaStreamSource(this.audioStream);
            // 创建 AudioWorkletNode
            this.workletNode = new AudioWorkletNode(this.context, "pcm-processor");


            // 监听 Worklet 发送的数据
            this.workletNode.port.onmessage = (event) => {
                const stereoChannelData = event.data;
                this.playPCM(stereoChannelData)
                // 将接收到的 PCM 数据传递到 AudioWorkletProcessor 中
                // this.workletNode?.port.postMessage(stereoChannelData);
                // this.player.feed(stereoChannelData.leftChannel, stereoChannelData.rightChannel);
            };

            // 连接音频流到 AudioWorkletNode
            this.audioInput.connect(this.analyser);
            this.analyser.connect(this.workletNode);

            // 连接 AudioWorkletNode 到音频输出设备
            this.workletNode.connect(this.context.destination);

        } catch (error) {
            console.error("获取麦克风音频失败", error);
        }
    }

    // ✅ 接收并用 AudioWorklet 播放 PCM 音频
    public onReceiveAudioBuffer() {
        this.audioWebSocket?.receiveAudioBuffer((userID: string, pcmData: ArrayBuffer) => {
            // 在这里你可以处理接收到的 PCM 数据
            const stereoChannelData = this.convertToStereoChannels(pcmData);
            this.playPCM(stereoChannelData);
        });
    }

    playPCM(stereoChannelData: {leftChannel: Float32Array, rightChannel: Float32Array; }): void {
        const { leftChannel, rightChannel } = stereoChannelData;

        const frameCount = leftChannel.length;
        const audioBuffer = this.context.createBuffer(2, frameCount, SAMPLERATE);

        // 将左右声道数据写入 AudioBuffer
        audioBuffer.copyToChannel(leftChannel, 0); // 左声道
        audioBuffer.copyToChannel(rightChannel, 1); // 右声道

        // 创建 AudioBufferSourceNode 播放音频
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;

        // 连接到音频上下文输出
        bufferSource.connect(this.context.destination);

        // 播放音频
        bufferSource.start();

        // 释放资源
        bufferSource.onended = () => {
            bufferSource.disconnect();
        };
    }

    // 将接收到的 PCM 数据转换为立体声数据
    private convertToStereoChannels(pcmData: ArrayBuffer): { leftChannel: Float32Array, rightChannel: Float32Array } {
        const pcmArray = new Float32Array(pcmData);
        const leftChannel = pcmArray.subarray(0, pcmArray.length / 2);
        const rightChannel = pcmArray.subarray(pcmArray.length / 2);

        return { leftChannel, rightChannel };
    }
}

export enum audioConnectType {
    websocket = "websocket",
    webrtc = "webrtc",
}

