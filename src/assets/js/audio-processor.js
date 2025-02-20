import * as lamejs from '@/assets/js/lamejs';

class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.mp3Encoder = null;
        this.mp3Data = [];
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const data = input[0];

            // 初始化mp3编码器
            if (!this.mp3Encoder) {
                this.mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128); // 单声道，采样率，比特率
            }

            // 将Float32Array转换为Int16Array以便于编码
            const samples = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) {
                samples[i] = data[i] * 0x7FFF; // 转换为16位整数
            }

            // 编码并收集MP3数据块
            const mp3Buf = this.mp3Encoder.encodeBuffer(samples);
            if (mp3Buf.length > 0) {
                this.mp3Data.push(mp3Buf);
            }

            // 发送音频数据到主线程
            this.port.postMessage(this.mp3Data);
        }

        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);