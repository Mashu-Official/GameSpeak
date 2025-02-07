import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import router from "../router";

const toast = useToast();

export const useDevicesStore = defineStore('useDevicesStore', {
    state: () => ({
        inputDevices: null,   // 音频输入设备列表  多个
        outputDevices: null,  // 音频输出设备列表  多个
        ////////////////////////////////////////////////
        audioInput: null,   // 当前音频输入设备  单个
        audioOutput: null,  // 当前音频输出设备  单个
        ////////////////////////////////////////////////
        defaultAudioInput: null,  // 默认输入
        defaultAudioOutput: null,  // 默认输出
        ////////////////////////////////////////////////
        inputVolume: 100,   // 输入音量
        outputVolume: 100,   // 输出音量
    }),
    actions: {
        async getDevices() {
            const deviceList = await navigator.mediaDevices.enumerateDevices();
            // console.log('设备列表:', deviceList);
            this.inputDevices = deviceList.filter(device => device.kind === 'audioinput');
            // console.log("输入",this.inputDevices)
            this.outputDevices = deviceList.filter(device => device.kind === 'audiooutput');
            // console.log("输出:",this.outputDevices)
            this.defaultAudioInput = this.inputDevices.find(device => device.deviceId === "default")
            this.defaultAudioOutput = this.outputDevices.find(device => device.deviceId === "default")
            console.log(this.defaultAudioInput)
            console.log(this.defaultAudioOutput)
        },
        selectDevice(device){
            const deviceKind = device.kind
            // 输出
            if (deviceKind === "audiooutput"){
                this.audioOutput = device
            }
            //输入
            else{
                this.audioInput = device
            }
        },
        async audioInputTest() {
            // if (this.audioInput) {

                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
                const constraints = {
                    audio: {deviceId: {exact: selectedAudioInput.value}}
                };

                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log('已切换到音频输入设备:', selectedAudioInput.value);
                return;
            // }
            // return
        },
        // start
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
