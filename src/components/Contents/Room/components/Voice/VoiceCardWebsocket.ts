import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";
import PCMPlayer from "pcm-player";
import {AudioWebSocket, audioPackage} from "./AudioWebSocket.ts";

const SAMPLERATE = 192000; // 采样率 768000
const SAMPLESIZE = 24 // 音频位数
const BUFFER_SIZE = 2048; // ScriptProcessorNode 缓冲大小 确保是 256、512、1024、2048、4096、8192、16384 之一
const CHANNELCOUNT = 2  // 声道数
const InputQuality = {
        autoGainControl:false,
    // echoCancellation: true, // 启用回声消除
    // noiseSuppression: true, // 启用噪声抑制
    // highpassFilter: true,  // 高通滤波器
}
console.log()

export class PcmRecorder {
    private config: any;
    private context: AudioContext;
    private readonly analyser: AnalyserNode;
    private readonly recorder: ScriptProcessorNode;
    public audioInput: MediaStreamAudioSourceNode | null = null;
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
            numberChannels: CHANNELCOUNT,
        };

        this.context = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: SAMPLERATE, // ✅ 显式设置
        });

        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = this.config.fftSize;


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
    async init_WebSocketMode(): Promise<void> {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia(this.config.constraints);
            // useDevicesStore().mediaStream = this.audioStream;

            this.audioInput = this.context.createMediaStreamSource(this.audioStream);
            this.audioInput.connect(this.analyser);

            this.analyser.connect(this.recorder);
            this.recorder.connect(this.context.destination);
            // 直接播放
            // this.audioInput.connect(this.context.destination);

        } catch (error) {
            console.error("获取麦克风音频失败", error);
        }
    }

    // ✅ 修正 `onaudioprocess`
    private onaudioprocess(e: AudioProcessingEvent): void {
        const inputBuffer = e.inputBuffer;
        const frameCount = inputBuffer.length;

        // 由于输入可能是双声道，这里确保数据存储
        const leftChannelData = new Float32Array(frameCount);
        const rightChannelData = new Float32Array(frameCount);
        const monoChannelData = new Float32Array(frameCount);

        inputBuffer.copyFromChannel(monoChannelData, 0);

        // // 获取左右声道数据
        // inputBuffer.copyFromChannel(leftChannelData, 0); // 左声道
        //
        // if (inputBuffer.numberOfChannels > 1) {
        //     inputBuffer.copyFromChannel(rightChannelData, 1); // 右声道
        // } else {
        //     rightChannelData.set(leftChannelData); // 如果只有一个声道，直接复制
        // }
        //
        // // 混合两个声道的数据（求平均值 -> 变成单声道）
        // for (let i = 0; i < frameCount; i++) {
        //     monoChannelData[i] = (leftChannelData[i] + rightChannelData[i]) / 2;
        // }

        this.playPCM(monoChannelData);
        // console.log("发送的数据", monoChannelData);
        this.audioWebSocket?.sendAudioBuffer(monoChannelData);
    }

    private playPCM(pcmData: Float32Array) {
        if (!this.context) {
            console.error("AudioContext 未初始化");
            return;
        }

        const frameCount = pcmData.length;

        // ✅ 创建单声道 AudioBuffer
        const audioBuffer = this.context.createBuffer(1, frameCount, SAMPLERATE);
        audioBuffer.copyToChannel(pcmData, 0);

        // ✅ 创建 AudioBufferSourceNode 作为播放源
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;

        // ✅ 创建 GainNode 控制音量
        const gainNode = this.context.createGain();
        gainNode.gain.value = 2; // 适当调整音量

        // ✅ 连接音频节点
        bufferSource.connect(gainNode);
        gainNode.connect(this.context.destination);

        // ✅ 播放音频
        bufferSource.start();
    }



    public onReceiveAudioBuffer() {
        this.audioWebSocket?.receiveAudioBuffer(async (userID: string, pcmData: ArrayBuffer) => {
            this.playAudioForUser(userID, pcmData);
            // this.playPCM(pcmData)
            // this.player.feed(pcmData)
            // console.log("接收到音频数据:", pcmData);
        });
    }

    playAudioForUser(userID: string, receiveBuffer: ArrayBuffer): void {
        // const SAMPLERATE = 384000; // 采样率
        // const SAMPLESIZE = 16 // 音频位数
        // const BUFFER_SIZE = 4096; // ScriptProcessorNode 缓冲大小 确保是 256、512、1024、2048、4096、8192、16384 之一
        // const CHANNELCOUNT = 2  // 声道数

        const frameCount = receiveBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT / CHANNELCOUNT; // 计算帧数

        // ✅ 使用 DataView 解析 Float32 PCM 数据
        const view = new DataView(receiveBuffer);
        const pcmData = new Float32Array(frameCount * CHANNELCOUNT);

        for (let i = 0; i < pcmData.length; i++) {
            pcmData[i] = view.getFloat32(i * 4, true); // 解析 Float32（小端字节序）
        }

        // ✅ 创建 AudioBuffer
        const audioBuffer = this.context.createBuffer(CHANNELCOUNT, frameCount, this.context.sampleRate);

        for (let channel = 0; channel < CHANNELCOUNT; channel++) {
            // ✅ 只提取当前通道的数据
            const channelData = new Float32Array(frameCount);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = pcmData[i * CHANNELCOUNT + channel]; // 按通道提取数据
            }
            audioBuffer.copyToChannel(channelData, channel);
        }

        // ✅ 创建 AudioBufferSourceNode 作为播放源
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = audioBuffer;

        // ✅ 创建 GainNode 控制音量
        const gainNode = this.context.createGain();
        gainNode.gain.value = 1.0; // 可调节音量

        // ✅ 连接音频节点
        bufferSource.connect(gainNode);
        gainNode.connect(this.context.destination);

        // ✅ 播放音频
        // bufferSource.start();
        // this.player.feed(pcmData);
    }
}

export enum audioConnectType {
    websocket = "websocket",
    webrtc = "webrtc",
}


