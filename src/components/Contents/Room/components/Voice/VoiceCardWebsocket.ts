import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";
import PCMPlayer from "pcm-player";
import {AudioWebSocket, audioPackage} from "./AudioWebSocket.ts";

const SAMPLERATE = 192000; // 采样率 768000
const SAMPLESIZE = 32 // 音频位数
const CHANNELCOUNT = 2  // 声道数
const InputQuality = {
    autoGainControl:false,  // 自动xxx
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
                this.audioWebSocket?.sendAudioBuffer(event.data)
                // this.player.feed(stereoChannelData.leftChannel, stereoChannelData.rightChannel);
            };

            // 连接音频流到 AudioWorkletNode
            this.audioInput.connect(this.analyser);
            this.analyser.connect(this.workletNode);

            // 连接 AudioWorkletNode 到音频输出设备
            // this.workletNode.connect(this.context.destination);

        } catch (error) {
            console.error("获取麦克风音频失败", error);
        }
    }

    // ✅ 接收并用 AudioWorklet 播放 PCM 音频
    public onReceiveAudioBuffer() {
        this.audioWebSocket?.receiveAudioBuffer((userID: string, pcmData: ArrayBuffer) => {
            // 在这里你可以处理接收到的 PCM 数据
            const stereoChannelData = this.convertToStereoChannels(pcmData);
            // this.playPCM(stereoChannelData);
        });
    }

    playPCM(stereoChannelData: { leftChannel: Float32Array, rightChannel: Float32Array }): void {
        this.workletNode.port.postMessage(stereoChannelData);
        //
        const { leftChannel, rightChannel } = stereoChannelData;

        // const leftFloat32Array = this.convertBufferToFloat32Array(leftChannel);
        // const rightFloat32Array = this.convertBufferToFloat32Array(rightChannel);

        const frameCount = leftChannel.length;
        const audioBuffer = this.context.createBuffer(2, frameCount, SAMPLERATE);

        // 将左右声道数据写入 AudioBuffer
        audioBuffer.copyToChannel(leftChannel, 0); // 左声道
        audioBuffer.copyToChannel(rightChannel, 1); // 右声道

        // audioBuffer.copyToChannel(leftFloat32Array, 0); // 左声道
        // audioBuffer.copyToChannel(rightFloat32Array, 1); // 右声道

        // 创建 AudioBufferSourceNode 播放音频
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;

        // 创建 GainNode 控制音量
        const gainNode = this.context.createGain();
        gainNode.gain.value = 1.0; // 可调节音量（这里设置为 1.0，表示正常音量）

        // 连接音频节点
        bufferSource.connect(gainNode); // 连接源节点到增益节点
        gainNode.connect(this.context.destination); // 连接增益节点到输出设备

        // 播放音频
        bufferSource.start();

        // 释放资源
        bufferSource.onended = () => {
            bufferSource.disconnect();
            gainNode.disconnect(); // 确保音频播放结束后断开连接
        };
    }

    convertBufferToFloat32Array(buffer, bitDepth = 16) {
        const length = buffer.length / (bitDepth / 8); // 计算每个样本的数量
        const float32Array = new Float32Array(length);

        for (let i = 0; i < length; i++) {
            const sample = buffer.readInt16LE(i * (bitDepth / 8)); // 使用 little-endian 格式读取 16 位数据

            // 将 16 位的整数样本归一化到 -1.0 到 1.0 范围
            float32Array[i] = sample / 32768.0;
        }

        return float32Array;
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

