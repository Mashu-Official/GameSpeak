<template>
    <div class="relative voiceSettingBtnGroup">
        <button @click="toggleAudioOutput()">
            <svg v-show="!noOutput" width="20" height="20" viewBox="0 0 48 48" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                      stroke="currentColor"
                      stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z"
                      fill="none"
                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                      fill="currentColor"/>
                <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z"
                      fill="currentColor"/>
                <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z" fill="none"
                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
            </svg>

            <svg v-show="noOutput" width="20" height="20" viewBox="0 0 48 48" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                      stroke="currentColor"
                      stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z"
                      fill="none"
                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                      fill="currentColor"/>
                <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z"
                      fill="currentColor"/>
                <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z" fill="none"
                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
            </svg>
        </button>

        <div class="absolute -translate-x-1/2  w-[640px] flex justify-center py-6"
             :class="{
                  'pb-[23px] bottom-5': displayPosition === 'top',
                  'pt-[23px] top-5': displayPosition === 'bottom'
                }"
        >
            <div class="ViewCard flex flex-col-reverse">
                <a-slider
                        v-model="outputVolume"
                        :default-value="outputVolume"
                        :style="{ width: '135px' }"

                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDevicesStore} from "@/pinia/deviceStore.ts";
import {onMounted, ref, watch} from "vue";
import {useToast} from "vue-toastification";
const toast = useToast();

const props = defineProps<{
    state: string
    displayPosition:string
}>()

const outputVolume = ref<number>(useDevicesStore().outputVolume);  // 初始化为store中的值
const noOutput = ref<boolean>(useDevicesStore().noOutput);  // 初始化为store中的值

if (props.state === 'self'){
const deviceStore = useDevicesStore()
// 双向绑定：监听 store 数据变化并更新本地 ref，同时将本地 ref 的变化同步回 store
    watch(() => deviceStore.outputVolume, (newVal) => {
        outputVolume.value = newVal;
    });

    watch(() => deviceStore.noOutput, (newVal) => {
        noOutput.value = newVal;
    });

    watch(() => outputVolume.value, (newVal) => {
        deviceStore.outputVolume = newVal;
    });

    watch(() => noOutput.value, (newVal) => {
        deviceStore.noOutput = newVal;
    });
}
else {
    outputVolume.value = 1
    noOutput.value = false
}
const toggleAudioOutput = () =>{
    if (props.state === 'self'){
        useDevicesStore().toggleAudioOutput()
    }
    else {
        console.log(1235)
        // useDevicesStore.toggleAudioOutput()
    }

}

onMounted(async () => {

});

</script>

<style scoped>

.voiceSettingBtnGroup {
    z-index: 50;
}

.voiceSettingBtnGroup div {
    opacity: 0;
    visibility: hidden;
}

.voiceSettingBtnGroup:hover div {
    opacity: 100;
    visibility: visible;
}

.voiceSettingBtnGroup div *:focus-within {
    opacity: 1;
    visibility: visible;
}

.voiceSettingBtnGroup div:hover {
    opacity: 100;
    visibility: visible;
}
</style>