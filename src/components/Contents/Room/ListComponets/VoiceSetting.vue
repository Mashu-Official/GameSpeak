<template>
    <div class="flex flex-row justify-between ViewCard items-center px-4 py-3 voiceSettingCard mb-3 mx-2">
        <button @click="()=>{
            if(useCurUserState().isElectronEnv){
                // 是electron环境 才允许这个
                deviceStore.pressToSpeak = !deviceStore.pressToSpeak
            }
            else {
                toast.warning('WEB端按键发言开发中')
            }
        }">
            <span v-if="useCurUserState().isElectronEnv">{{ deviceStore.pressToSpeak ? '按键发言' : '自由发言' }}</span>
            <span v-else>{{ '自由发言' }}</span>
        </button>

<!--        TODO 要拆组件 公共化 进入房间后要关闭这个组件 -->
        <div class="flex flex-row space-x-4">
            <!--音频输入-->
           <InputBTN :state="'self'" :displayPosition="'top'"/>

            <!--音频输出-->
            <OutputBTN :state="'self'" :displayPosition="'top'"/>
        </div>
    </div>


</template>

<script setup lang="ts">
import {useDevicesStore} from "@/pinia/deviceStore.ts";
import {onMounted} from "vue";
import {useCurUserState} from "../../../../pinia/curUserState.ts";
import {useToast} from "vue-toastification";
import InputBTN from "./InputBTN.vue";
import OutputBTN from "./OutputBTN.vue";
const toast = useToast();

const deviceStore = useDevicesStore();

onMounted(async () => {

});


// const inputVolume =ref(deviceStore.inputVolume)
// watch(()=>inputVolume,()=>{
//
// })
</script>


<style scoped>
.voiceSettingCard {
    border-radius: 1rem;
    border: 2px solid #6e6d6d;
}

.voiceSettingBtnGroup {
    z-index: 50;
}
</style>
