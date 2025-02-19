<template>
    <div class="flex flex-col w-full space-y-4">

        <div class="flex flex-col">
            <div class="flex flex-row text-lg font-semibold mb-2">
                设备与音量
            </div>
            <div class="flex flex-col w-full space-y-2 items-center py-8 ViewCard">

                <div class="flex flex-col w-full space-y-4 items-center">
                    <div class="flex flex-col space-y-1 ">
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

                    <div class="flex flex-col space-y-1 ">
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
                                <a-option :value="device" :label="device.label">
                                    {{ device.label || '未命名' }}
                                </a-option>
                            </template>
                        </a-select>

                    </div>
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

                </div>

                <div class="flex flex-col w-full items-center">
                    <!-- 测试麦克风 -->
                    <div class="flex flex-col space-y-4 items-start w-full px-7">
                        <span class="text-base font-bold">测试麦克风</span>
                        <div class="flex justify-between">
<!--                            <button class="font-semibold" @click="toggleTestMic">{{ isTestingMic ? '停止测试' : '开始测试' }}</button>-->
                        </div>
                    </div>

                    <!--                &lt;!&ndash; 波形图 &ndash;&gt;-->
                    <!--                <div class="flex flex-row flex-1">-->
                    <!--                    <canvas ref="canvas" height="16"></canvas>-->
                    <!--                </div>-->
                </div>

            </div>
        </div>

        <div class="flex flex-col">
            <div class="flex flex-row text-lg font-semibold mb-2">
                输入模式与快捷键
            </div>

            <div class="flex flex-col w-full space-y-2 items-center px-11 py-8 ViewCard">

                <div class="flex flex-col space-y-4 items-start w-full">

                    <div class="flex flex-row space-x-2 justify-between w-full">
                        <span class="text-base font-bold">语音输入模式: </span>
                        <div class="flex flex-row justify-between">
                           自由发言
                        </div>
                        <div class="flex flex-row justify-between">
                            按键发言
                        </div>
                    </div>
                    <!-- 自定义快捷键 -->
                    <div class="flex flex-row space-x-2 justify-between w-full">
                        <span class="text-base font-bold">麦克风打开/关闭快捷键:</span>
                        <input type="text" v-model="deviceStore.micToggleKey" placeholder="Ctrl + M">
                    </div>
                    <div class="flex flex-row space-x-2 justify-between w-full">
                        <span class="text-base font-bold">静音/取消静音快捷键:</span>
                        <input type="text" v-model="deviceStore.muteToggleKey" placeholder="Ctrl + S">
                    </div>
                    <div class="flex flex-row space-x-2 justify-between w-full">
                        <span class="text-base font-bold">按键发言快捷键:</span>
                        <input type="text" v-model="deviceStore.pushToTalkKey" placeholder="Ctrl + P">
                    </div>

                    <audio ref="audioElement" autoplay></audio>
                </div>

            </div>
        </div>

        <div class="flex flex-col">
            <div class="flex flex-row text-lg font-semibold ">
                语音质量
            </div>

            <div class="flex flex-col w-full space-y-2 items-center px-11 py-8 ViewCard mb-4">

                <div class="flex flex-col space-y-4 items-start w-full">



                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, nextTick, onUnmounted} from 'vue';
import {useDevicesStore} from "@/pinia/deviceStore.ts";
// import {useDevicesStore} from '../../../pinia/deviceStore.ts'

const deviceStore = useDevicesStore()


// 必须这么写 不然选择框会BUG
if (!deviceStore.inputDevices){
    deviceStore.getDevices()
}
onMounted(async () => {
    // console.log('default',deviceStore.defaultAudioInput)
    // console.log('default',deviceStore.defaultAudioOutput)
    // console.log(defaultInput.value)
    // console.log(defaultOutput.value)
    // console.log(defaultOutput.value, defaultInput.value)
    // console.log(deviceStore.audioInput)
    // console.log(deviceStore.audioOutput)
})

const logVal = (val) =>{
    console.log('cur',val)
}


const audioElement = ref<HTMLAudioElement | null>(null);

// 状态管理
let mediaStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let source: MediaStreamAudioSourceNode | null = null;

// // 快捷键配置
// const micToggleKey = ref('Ctrl + M');
// const muteToggleKey = ref('Ctrl + S');
// const pushToTalkKey = ref('Ctrl + P');
//
// // 监听快捷键
// onMounted(() => {
//     window.addEventListener('keydown', handleKeydown);
// });
//
// const handleKeydown = (event: KeyboardEvent) => {
// const { altKey, ctrlKey, shiftKey, key, code } = e;
// if (!CODE_CONTROL.includes(key)) {
//     if (!this.keyRange.includes(code)) return;
//     let controlKey = "";
//     [
//         { key: altKey, text: "Alt" },
//         { key: ctrlKey, text: "Ctrl" },
//         { key: shiftKey, text: "Shift" }
//     ].forEach(curKey => {
//         if (curKey.key) {
//             if (controlKey) controlKey += "+";
//             controlKey += curKey.text;
//         }
//     });
//     if (key) {
//         if (controlKey) controlKey += "+";
//         controlKey += key.toUpperCase();
//     }
//     this.addHotkey({ text: controlKey, controlKey: { altKey, ctrlKey, shiftKey, key, code } });
// }
// e.preventDefault();
//     const keyCombination = `${event.ctrlKey ? 'Ctrl + ' : ''}${event.shiftKey ? 'Shift + ' : ''}${event.altKey ? 'Alt + ' : ''}${event.key.toUpperCase()}`;
//     console.log(keyCombination)
//     if (keyCombination === micToggleKey.value) {
//         toggleTestMic();
//     } else if (keyCombination === muteToggleKey.value) {
//         console.log('静音/取消静音');
//     } else if (keyCombination === pushToTalkKey.value) {
//         console.log('按下发言');
//     }
// };

onUnmounted(() => {
    // window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
input{
    background-color: transparent;
}
.ViewCard{
    --tw-bg-opacity: 1;
    background-color: rgb(243 243 243 / var(--tw-bg-opacity));
}
:is(.dark .ViewCard) {
    --tw-bg-opacity: 1;
    background-color: rgb(28 28 32 / var(--tw-bg-opacity));
}
</style>