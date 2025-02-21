import {reactive, ref} from 'vue';
import {useDevicesStore} from "../../../../../pinia/deviceStore.ts";
import { Socket } from "socket.io-client";
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
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
        source.start(currentTime + 0.1); // 延迟播放0.1秒（根据需要调整）

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
    private mergeAudioBuffers = (audioPackageList: Map<string, AudioBuffer[]>): AudioBuffer => {
        // 合并所有用户的音频缓冲区
        let allBuffers: AudioBuffer[] = [];

        // 遍历 Map 中的每个用户，获取音频缓冲区
        audioPackageList.forEach((buffers, userID) => {
            console.log(`合并来自用户 ${userID} 的音频数据`);
            allBuffers = allBuffers.concat(buffers); // 将每个用户的缓冲区合并到总缓冲区数组中
        });

        // 合并音频缓冲区
        const totalLength = allBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
        const mergedBuffer = this.context.createBuffer(1, totalLength, this.context.sampleRate);

        let offset = 0;
        allBuffers.forEach(buffer => {
            mergedBuffer.getChannelData(0).set(buffer.getChannelData(0), offset);
            offset += buffer.length;
        });

        console.log(mergedBuffer)
        return mergedBuffer;
    }

}



export class AudioWebSocket {
    // private socket: Socket;
    private audioPackageList: Map<string, AudioBuffer[]> = new Map(); // 使用 Map 存储每个用户的音频数据
    // 创建音频上下文（AudioContext）对象，用于管理音频资源的处理与控制
    private context: AudioContext;
    private hasLogged: boolean = false; // 标志变量，确保只打印一次

    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
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
    receiveAudioBuffer(callback: Function): void {
        window.socket.on('receiveAudioStream', (audioPackage: audioPackage) => {
            // 预处理 根据userID 分开不同的audioBuffer再合并
            // const userID = audioPackage.userID;
            const audioBufferData = audioPackage.audioBuffer;

            // 检查数据类型，如果是 ArrayBuffer，需要转换为 Float32Array
            if (audioBufferData instanceof ArrayBuffer) {
                // 转换 ArrayBuffer 为 Float32Array
                const float32Array = new Float32Array(audioBufferData);

                // 只在第一次接收到数据时打印
                // if (!this.hasLogged) {
                    console.log('接收到 PCM 数据:', float32Array);
                    // console.log('PCM 数据长度:', float32Array.length);
                    this.hasLogged = true;  // 设置标志为 true，确保之后不再打印
                // }

                // 使用 PCM 数据构造 AudioBuffer
                this.createAudioBufferFromPCM(float32Array).then(decodedBuffer => {
                    // 播放解码后的音频数据
                    this.playAudioBuffer(decodedBuffer);

                    // 可选：继续处理音频数据
                    // callback(this.audioPackageList);
                }).catch(error => {
                    console.error('构造 AudioBuffer 时出错', error);
                });
            } else {
                console.error('接收到的音频数据类型不正确，期望 ArrayBuffer');
            }
        });
    }

    // 从 PCM 数据创建 AudioBuffer
    private async createAudioBufferFromPCM(pcmData: Float32Array): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            // 检查 PCM 数据是否为空或无效
            if (!pcmData || pcmData.length === 0) {
                console.error('PCM 数据为空或长度为零');
                reject(new Error('PCM 数据为空，无法创建 AudioBuffer'));
                return;
            }

            const numberOfChannels = 2; // 假设你使用单通道音频数据
            const length = pcmData.length; // 数据大小
            const sampleRate = 768000; // 采样率

            try {
                // 创建一个新的 AudioBuffer
                const audioBuffer = this.context.createBuffer(numberOfChannels, length, sampleRate);

                // 将 PCM 数据填充到 AudioBuffer 中
                audioBuffer.getChannelData(0).set(pcmData);

                resolve(audioBuffer);
            } catch (error) {
                console.error('构造 AudioBuffer 时出错:', error);
                reject(new Error('构造 AudioBuffer 时出错: ' + error.message));
            }
        });
    }



    // 播放音频数据
    private playAudioBuffer(audioBuffer: AudioBuffer): void {
        const source = this.context.createBufferSource();
        source.buffer = audioBuffer;

        // 获取 PCM 数据并放大
        const pcmData = audioBuffer.getChannelData(0);
        const amplificationFactor = 30;  // 放大因子，可以调整这个值

        // 放大音频信号
        for (let i = 0; i < pcmData.length; i++) {
            pcmData[i] *= amplificationFactor;
        }

        // 连接到上下文的输出，播放音频
        source.connect(this.context.destination);

        // 开始播放音频
        source.start(0);
    }
}

interface audioPackage {
    userID: string,
    audioBuffer: AudioBuffer,
}