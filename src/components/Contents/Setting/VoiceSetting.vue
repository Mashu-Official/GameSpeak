<template>
    <div class="flex flex-col w-full space-y-2">
        <div class="flex flex-col w-full space-y-1">
            <span class="text-base font-bold">输入设备</span>
            <a-select
                    :style="{width:'420px'}"
                    :defaultValue="deviceStore.audioInput || deviceStore.defaultAudioInput"
                    :default-input-value="deviceStore.audioInput || deviceStore.defaultAudioInput"
                    v-model="deviceStore.audioInput"
                    :change="logVal(deviceStore.audioInput)"
                    placeholder="选择输入设备"
                    value-key="deviceId"
            >
                <template v-for="(device,index) in deviceStore.inputDevices"
                          :key="index"
                          >
                    <a-option :value="device" :label="device.label">
                        {{ device.label || '未命名' }}
                    </a-option>
                </template>

            </a-select>
        </div>

        <div class="flex flex-col w-full space-y-1">
            <span class="text-base font-bold">输出设备</span>
            <a-select
                    :style="{width:'420px'}"
                    :default-value="deviceStore.audioOutput || deviceStore.defaultAudioOutput"
                    :default-input-value="deviceStore.audioOutput || deviceStore.defaultAudioOutput"
                    v-model="deviceStore.audioOutput"
                    :change="logVal(deviceStore.audioOutput)"
                    placeholder="选择输出设备"
                    value-key="deviceId"
            >
                <template v-for="(device,index) in deviceStore.outputDevices" :key="index">
                    <a-option :value="device">
                        {{ device.label || '未命名' }}
                    </a-option>
                </template>
            </a-select>

        </div>

        <div class="flex flex-col space-y-1 pt-4">
            <div class="flex flex-col">
                <span class="text-base font-bold">麦克风输入音量</span>
                <a-space direction="vertical" size="large">
                    <a-slider :default-value="deviceStore.inputVolume"
                              v-model="deviceStore.inputVolume" :style="{ width: '420px' }"
                              show-input/>
                </a-space>
            </div>

            <div class="flex flex-col">
                <span class="text-base font-bold">设备输出音量</span>
                <a-space direction="vertical" size="large">
                    <a-slider :default-value="deviceStore.outputVolume"
                              v-model="deviceStore.outputVolume" :style="{ width: '420px' }" show-input/>
                </a-space>
            </div>

            <div class="flex flex-row">
                <span class="text-base font-bold">测试麦克风</span>

            </div>

            <div class="flex flex-row">
                <span class="text-base font-bold">麦克风打开/关闭快捷键</span>

            </div>

            <div class="flex flex-row">
                <span class="text-base font-bold">打开/关闭静音快捷键</span>

            </div>

            <div class="flex flex-row">
                <span class="text-base font-bold">按键发言快捷键</span>

            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, nextTick} from 'vue';
// import {useDevicesStore} from "@/pinia/deviceStore.js";
import {useDevicesStore} from '../../../pinia/deviceStore.js'

const deviceStore = useDevicesStore()

const followSystemAudioSetting = ref<boolean>()

// console.log(deviceStore.inputDevices)
// console.log(deviceStore.outputDevices)

// localStorage.clear()
// 必须这么写 不然选择框会BUG
if (!deviceStore.inputDevices){
    deviceStore.getDevices()
}
onMounted(async () => {
    console.log('default',deviceStore.defaultAudioInput)
    console.log('default',deviceStore.defaultAudioOutput)
    // console.log(defaultInput.value)
    // console.log(defaultOutput.value)
    // console.log(defaultOutput.value, defaultInput.value)
    console.log(deviceStore.audioInput)
    console.log(deviceStore.audioOutput)
})

const logVal = (val) =>{
    console.log(val)
}

</script>

<style scoped>

</style>