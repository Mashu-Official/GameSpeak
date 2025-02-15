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
        inputVolumeBefore: 100 as number,   // 改动前的输入音量
        outputVolume: 100 as number,   // 输出音量
        outputVolumeBefore: 100 as number,   // 改动前的输出音量
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
        async startMic() {
            try {
                const constraints = {
                    audio: {deviceId: this.audioInput?.deviceId ? {exact: this.audioInput.deviceId} : undefined}
                };
                this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                this.audioContext = new AudioContext();
                if (this.mediaStream && this.audioContext) {
                    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
                    this.source.connect(this.audioContext.destination);
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
            if (this.inputVolume === 0){
                this.inputVolume = this.inputVolumeBefore
            }else {
                this.inputVolume = 0
            }
        },
        toggleAudioOutput(){
            if (this.outputVolume === 0){
                this.outputVolume = this.outputVolumeBefore
            }else {
                this.outputVolume = 0
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