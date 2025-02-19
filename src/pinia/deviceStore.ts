import { defineStore } from "pinia";
import { ref } from 'vue';

// @ts-ignore
export const useDevicesStore = defineStore('useDevicesStore', {
    state: () => ({
        // 设备列表
        inputDevices: null as MediaDeviceInfo[] | null,   // 音频输入设备列表  多个
        outputDevices: null as MediaDeviceInfo[] | null,  // 音频输出设备列表  多个
        // 当前设备
        audioInput: null as MediaDeviceInfo | null,   // 当前音频输入设备  单个
        audioOutput: null as MediaDeviceInfo | null,  // 当前音频输出设备  单个
        // 系统默认设备
        defaultAudioInput: null as MediaDeviceInfo | null,  // 默认输入
        defaultAudioOutput: null as MediaDeviceInfo | null,  // 默认输出
        // 音量
        inputVolume: 100 as number,   // 输入音量
        outputVolume: 100 as number,   // 输出音量
        noInput: false as boolean,    // 禁用音频输入
        noOutput: false as boolean,  // 禁用音频输出
        // 按键说话
        pressToSpeak: true as boolean,
        pressKey: '' as string,
        // WebRTC相关
        mediaStream: null as MediaStream | null, // 当前音频流
        audioContext: null as AudioContext | null, // 当前音频上下文
        source: null as MediaStreamAudioSourceNode | null, // 当前音频源
        isTestingMic: false, // 是否正在测试麦克风
        // 快捷键 ↓
        micToggleKey: '' as string | null,  // 开闭麦快捷键
        muteToggleKey:'' as string | null,  // 语音静音快捷键 就是听不见
        pushToTalkKey:'' as string | null,  // 按键说话快捷键
    }),
    actions: {
        async getDevices() {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            // console.log('设备列表:', deviceList);
            this.inputDevices = deviceList.filter(device => device.kind === 'audioinput');
            // console.log("输入",this.inputDevices)
            this.outputDevices = deviceList.filter(device => device.kind === 'audiooutput');
            // console.log("输出:",this.outputDevices)
            // @ts-ignore
            this.defaultAudioInput = this.inputDevices.find(device => device.deviceId === "default")
            // @ts-ignore
            this.defaultAudioOutput = this.outputDevices.find(device => device.deviceId === "default")
            // console.log(this.defaultAudioInput)
            // console.log(this.defaultAudioOutput)
        },
        selectDevice(device: MediaDeviceInfo | null, kind?: string) {
            if (!device) return;
            if (!kind || kind === 'audioinput') {
                this.audioInput = device;
            }
            if (!kind || kind === 'audiooutput') {
                this.audioOutput = device;
            }
        },
        async audioInputTest() {
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
            }
            if (this.audioInput) {
                const constraints = {audio: {deviceId: this.audioInput.deviceId ? {exact: this.audioInput.deviceId} : undefined}};
                try {
                    this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    console.log('已切换到音频输入设备:', this.audioInput.deviceId);
                } catch (err) {
                    console.error("Error accessing microphone for test", err);
                }
            }
        },

        logDevices() {
            // @ts-ignore
            const logKeyValue = (key, value) => {
                console.log(`${key}:`, value);
            };

            // // 打印设备列表
            // logKeyValue('inputDevices', this.inputDevices);
            // logKeyValue('outputDevices', this.outputDevices);

            // 打印当前设备
            logKeyValue('audioInput', this.audioInput.label);
            logKeyValue('audioOutput', this.audioOutput.label);

            // 打印系统默认设备
            logKeyValue('defaultAudioInput', this.defaultAudioInput.label);
            logKeyValue('defaultAudioOutput', this.defaultAudioOutput.label);
        },

        async startMic() {
            try {
                this.logDevices()
                // 设置获取音频流的约束条件，如果指定了音频输入设备，则使用其deviceId；否则不限定设备
                const constraints = {
                    audio: this.audioInput?.deviceId ? { deviceId: { exact: this.audioInput.deviceId } } : true
                };

                // 获取用户的媒体流（在这里是音频流）
                this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log('成功获取到音频流:', this.mediaStream);

                // 创建AudioContext实例
                this.audioContext = new AudioContext();

                if (this.mediaStream && this.audioContext) {
                    // 从媒体流中创建一个MediaStreamAudioSourceNode作为音频源
                    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);

                    // 将音频源连接到AudioContext的destination以通过默认输出设备播放音频
                    this.source.connect(this.audioContext.destination);
                    console.log('音频源已连接到默认输出设备');

                    // 标记正在测试麦克风
                    this.isTestingMic = true;
                }
            } catch (err) {
                console.error("Error accessing microphone", err);
            }
        },
        stopMic() {
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
                this.mediaStream = null;
            }
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            if (this.source) {
                this.source.disconnect();
                this.source = null;
            }
            this.isTestingMic = false;
        },
        async toggleTestMic() {
            if (this.isTestingMic) {
                await this.stopMic();
            } else {
                await this.startMic();
            }
        },
        toggleMicroPhone(){
           this.noInput = !this.noInput
            if (this.noInput){

            }
        },
        toggleAudioOutput(){
            this.noOutput = !this.noOutput
            if (this.noOutput){

            }
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage, // 对全体持久化
            }
        ]
    }
});