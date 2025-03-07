class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferQueue = []; // 🔹 PCM 数据缓冲队列
        this.port.onmessage = (event) => {
            this.bufferQueue.push(event.data); // 🔹 接收 PCM 数据并存入队列
        };
    }

    process(inputs, outputs) {
        const output = outputs[0]; // 处理输出
        const channel = output[0];

        if (this.bufferQueue.length > 0) {
            const pcmData = this.bufferQueue.shift(); // 🔹 取出一帧 PCM 数据
            if (pcmData.length === channel.length) {
                channel.set(pcmData);
            } else {
                for (let i = 0; i < channel.length; i++) {
                    channel[i] = pcmData[i % pcmData.length]; // 🔹 适配不同的 buffer size
                }
            }
        } else {
            // 🔹 如果队列为空，则填充 0（避免杂音）
            channel.fill(0);
        }

        return true; // 继续处理
    }
}

registerProcessor("pcm-processor", AudioProcessor);
