class PcmWorkletProcessor extends AudioWorkletProcessor {
    process(inputs: Float32Array[][]) {
        const input = inputs[0]; // 取第一个输入流
        if (input) {
            this.port.postMessage(input[0]); // 发送 PCM 数据到主线程
        }
        return true;
    }
}

registerProcessor("pcm-worklet", PcmWorkletProcessor);
