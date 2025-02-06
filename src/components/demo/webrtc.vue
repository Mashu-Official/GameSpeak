<template>
    <div class="flex flex-col justify-center items-center w-full h-full flex-1">
        <h2>音频输入设备</h2>
        <ul>
            <li v-for="device in audioInputDevices" :key="device.deviceId">{{ device.label || '未命名' }}</li>
        </ul>

        <h2>音频输出设备</h2>
        <ul>
            <li v-for="device in audioOutputDevices" :key="device.deviceId">{{ device.label || '未命名' }}</li>
        </ul>

            <h2>选择音频输入设备</h2>
            <select v-model="selectedAudioInput" @change="setAudioInputDevice">
                <option v-for="device in audioInputDevices" :key="device.deviceId" :value="device.deviceId">
                    {{ device.label || '未命名' }}
                </option>
            </select>

            <h2>选择音频输出设备</h2>
            <select v-model="selectedAudioOutput" @change="setAudioOutputDevice">
                <option v-for="device in audioOutputDevices" :key="device.deviceId" :value="device.deviceId">
                    {{ device.label || '未命名' }}
                </option>
            </select>

    </div>


</template>
<script setup>
import { ref, onMounted } from 'vue';

const devices = ref([]);
const audioInputDevices = ref([]);
const audioOutputDevices = ref([]);
const selectedAudioInput = ref('');
const selectedAudioOutput = ref('');

let mediaStream = null;

async function fetchDevices() {
    try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        devices.value = deviceList;
        console.log('设备列表:', devices.value);
        audioInputDevices.value = deviceList.filter(device => device.kind === 'audioinput');
        audioOutputDevices.value = deviceList.filter(device => device.kind === 'audiooutput');

        // 如果有默认设备，可以预先选择它们
        if (audioInputDevices.value.length > 0) {
            selectedAudioInput.value = audioInputDevices.value[0].deviceId;
        }
        if (audioOutputDevices.value.length > 0) {
            selectedAudioOutput.value = audioOutputDevices.value[0].deviceId;
        }

        // 请求访问音频输入设备以获取标签信息
        await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
        console.error('获取设备列表失败：', err);
    }
}

async function setAudioInputDevice() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
    const constraints = {
        audio: { deviceId: { exact: selectedAudioInput.value } }
    };
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('已切换到音频输入设备:', selectedAudioInput.value);
}

// 对于音频输出设备的选择，Web API 目前不支持直接选择输出设备。
// 可以考虑使用 Web Audio API 和 `setSinkId` 方法（如果浏览器支持）
async function setAudioOutputDevice() {
    const audioElement = new Audio();
    try {
        await audioElement.setSinkId(selectedAudioOutput.value);
        console.log('已切换到音频输出设备:', selectedAudioOutput.value);
    } catch (err) {
        console.error('设置音频输出设备失败：', err);
    }
}

onMounted(() => {
    fetchDevices();
});
</script>

<style scoped>
/* 添加一些样式 */
</style>