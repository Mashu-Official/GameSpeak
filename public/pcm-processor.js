class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferQueue = []; // 存储待播放的 PCM 数据
        this.sampleRate = 192000; // 指定采样率，如果需要可以修改
        this.bitDepth = 32; // 指定位深
        this.port.onmessage = (event) => {
            if (event.data.leftChannel && event.data.rightChannel) {
                this.bufferQueue.push(event.data); // 存入缓冲队列
            }
        };
    }

    process(inputs, outputs) {
        const input = inputs[0]; // 🎤 输入音频数据
        const output = outputs[0]; // 🔊 输出音频数据

        // ✅ 先转发输入音频（保留现有逻辑）
        if (input.length >= 2) {
            const leftChannel = input[0];
            const rightChannel = input[1];

            for (let i = 0; i < leftChannel.length; i++) {
                output[0][i] = leftChannel[i];
                output[1][i] = rightChannel[i];
            }

            this.port.postMessage({ leftChannel, rightChannel });
        }
        else if (input.length === 1) {
            const monoChannel = input[0];

            for (let i = 0; i < monoChannel.length; i++) {
                output[0][i] = monoChannel[i];
                output[1][i] = monoChannel[i]; // 🔄 复制单声道到右声道
            }

            this.port.postMessage({ leftChannel: monoChannel, rightChannel: monoChannel });
        }

        // ✅ 播放主线程发送的 PCM 数据
        if (this.bufferQueue.length > 0) {
            // console.log(this.bufferQueue)
            const pcmData = this.bufferQueue.shift(); // 取出一帧 PCM 数据
            const leftData = pcmData.leftChannel;
            const rightData = pcmData.rightChannel;

            // 确保数据长度匹配
            const bufferSize = output[0].length ;

            // 如果数据长度小于输出缓冲区，平滑填充
            const leftDataLength = leftData.length;
            const rightDataLength = rightData.length;

            for (let i = 0; i < bufferSize; i++) {
                // 避免索引越界的同时，防止音频数据重复产生杂音
                output[0][i] = leftData[i % leftDataLength];
                output[1][i] = rightData[i % rightDataLength];
            }
        }

        return true; // 继续处理
        // return false // 停止处理
    }
}

registerProcessor("pcm-processor", AudioProcessor);
