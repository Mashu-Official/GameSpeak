// audio-processor.js
class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input[0]) {
            const inputData = input[0]; // 获取第一个音轨的数据
            this.port.postMessage(inputData); // 将音频数据发送到主线程
        }
        return true; // 保持处理器运行
    }
}

registerProcessor('audio-processor', AudioProcessor);