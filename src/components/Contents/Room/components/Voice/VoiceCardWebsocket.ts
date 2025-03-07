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
    private workletNode: AudioWorkletNode | null =null;
    private audioInput: MediaStreamAudioSourceNode | null = null;
    protected audioStream: MediaStream | null = null;
    private audioWebSocket: AudioWebSocket | null = null;
    public isWebsocketOrWebRTC_mode: audioConnectType;

    constructor(isWebsocketOrWebRTC_mode = audioConnectType.websocket) {
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
            await this.context.audioWorklet.addModule("/pcm-processor.js");

            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: true,
                    channelCount: CHANNELCOUNT,
                    sampleRate: SAMPLERATE,
                    sampleSize: SAMPLESIZE,
                    volume: useDevicesStore().inputVolume,
                    ...InputQuality
                }
            });

            this.audioInput = this.context.createMediaStreamSource(this.audioStream);
            this.workletNode = new AudioWorkletNode(this.context, "pcm-processor");

            // 监听 Worklet 发送的数据
            this.workletNode.port.onmessage = (event) => {
                const stereoChannelData = event.data;
                // console.log(stereoChannelData)
                this.playPCM({...stereoChannelData})
                // this.audioWebSocket?.sendAudioBuffer(stereoChannelData);
            };

            // 连接音频流
            this.audioInput.connect(this.analyser);
            this.analyser.connect(this.workletNode);

            // 播放
            // this.workletNode.connect(this.context.destination);

        } catch (error) {
            console.error("获取麦克风音频失败", error);
        }
    }

    // ✅ 接收并用 AudioWorklet 播放 PCM 音频
    public onReceiveAudioBuffer() {
        this.audioWebSocket?.receiveAudioBuffer((userID: string, pcmData: ArrayBuffer) => {
            // this.playPCM(pcmData);
        });
    }

    private playPCM(stereoChannelData: { leftChannel: Float32Array, rightChannel: Float32Array }) {
        const frameCount = stereoChannelData.leftChannel.length;

        // 创建一个 AudioBuffer，用于播放双声道音频
        const audioBuffer = this.context.createBuffer(CHANNELCOUNT, frameCount, this.context.sampleRate);

        // 将左声道数据和右声道数据分别填充到 AudioBuffer 中
        audioBuffer.copyToChannel(stereoChannelData.leftChannel, 0); // 左声道
        audioBuffer.copyToChannel(stereoChannelData.rightChannel, 1); // 右声道

        // 创建 AudioBufferSourceNode 作为音频源
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;

        // 创建 GainNode 控制音量，避免过高增益导致失真
        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(0.5, this.context.currentTime); // 调低增益值
        gainNode.gain.linearRampToValueAtTime(1.0, this.context.currentTime + 0.1); // 渐增至正常音量

        // 连接音频节点
        bufferSource.connect(gainNode);
        gainNode.connect(this.context.destination);

        // 播放音频
        bufferSource.start();

        // 确保播放完成后释放资源
        bufferSource.onended = () => {
            bufferSource.disconnect();
            gainNode.disconnect();
        };
    }
}
export enum audioConnectType {
    websocket = "websocket",
    webrtc = "webrtc",
}
