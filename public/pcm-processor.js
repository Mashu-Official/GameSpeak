class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferSize = 1024;  // 缓冲区大小
        this.buffer = new Float32Array(this.bufferSize * 2);  // 2声道（左右声道），大小为 bufferSize * 2
        this.writeIndex = 0;  // 当前写入缓冲区的位置
    }

    // process(inputs, outputs) {
    //     const input = inputs[0];  // 输入音频数据
    //     const output = outputs[0]; // 输出音频数据
    //
    //     // 确保输入有效且有数据
    //     if (input.length >= 2) {
    //         const leftChannel = input[0];
    //         const rightChannel = input[1];
    //
    //         // 将数据写入环形缓冲区
    //         this.writeToBuffer(leftChannel, rightChannel);
    //
    //         // 从缓冲区中读取数据并传递到输出
    //         this.readFromBuffer(output);
    //
    //         // 发送数据到主线程
    //         this.port.postMessage({
    //             leftChannel: Float32Array.from(leftChannel),
    //             rightChannel: Float32Array.from(rightChannel)
    //         });
    //
    //     } else if (input.length === 1) {
    //         const monoChannel = input[0];
    //
    //         // 将单声道音频复制到双声道输出
    //         this.writeToBuffer(monoChannel, monoChannel);
    //
    //         // 从缓冲区中读取数据并传递到输出
    //         this.readFromBuffer(output);
    //
    //         // 发送单声道数据到主线程，复制到左右声道
    //         this.port.postMessage({
    //             leftChannel: Float32Array.from(monoChannel),
    //             rightChannel: Float32Array.from(monoChannel)
    //         });
    //     }
    //
    //     return true; // 表示继续处理音频
    // }
    process(inputs, outputs) {
        const input = inputs[0];  // 输入音频数据
        const output = outputs[0]; // 输出音频数据

        // 确保输入有效且有数据
        if (input.length >= 2) {
            const leftChannel = input[0];
            const rightChannel = input[1];

            // 将数据写入环形缓冲区
            this.writeToBuffer(leftChannel, rightChannel);

            // 从缓冲区中读取数据并传递到输出
            this.readFromBuffer(output);

            // 发送数据到主线程
            this.port.postMessage({
                leftChannel: Float32Array.from(leftChannel),
                rightChannel: Float32Array.from(rightChannel)
            });

        } else if (input.length === 1) {
            const monoChannel = input[0];

            // 将单声道音频复制到双声道输出
            this.writeToBuffer(monoChannel, monoChannel);

            // 从缓冲区中读取数据并传递到输出
            this.readFromBuffer(output);

            // 发送单声道数据到主线程，复制到左右声道
            this.port.postMessage({
                leftChannel: Float32Array.from(monoChannel),
                rightChannel: Float32Array.from(monoChannel)
            });
        }

        return true; // 表示继续处理音频
    }

    // 将输入数据写入缓冲区
    writeToBuffer(leftChannel, rightChannel) {
        for (let i = 0; i < leftChannel.length; i++) {
            this.buffer[this.writeIndex] = leftChannel[i]; // 写入左声道
            this.buffer[this.writeIndex + this.bufferSize] = rightChannel[i]; // 写入右声道
            this.writeIndex++;

            // 如果写入到达缓冲区末尾，重新开始
            if (this.writeIndex >= this.bufferSize) {
                this.writeIndex = 0;
            }
        }
    }

    // 从缓冲区读取数据并传递到输出
    readFromBuffer(output) {
        let outputIndex = 0;

        // 从缓冲区读取数据并填充输出
        for (let i = 0; i < this.bufferSize; i++) {
            output[0][i] = this.buffer[i];  // 左声道
            output[1][i] = this.buffer[i + this.bufferSize];  // 右声道
            outputIndex++;
        }
    }
}

// 注册 AudioProcessor
registerProcessor("pcm-processor", AudioProcessor);
