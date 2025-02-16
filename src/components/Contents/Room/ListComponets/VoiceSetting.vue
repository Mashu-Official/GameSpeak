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

        <div class="flex flex-row space-x-2.5">
            <!--音频输入-->
            <div class="relative voiceSettingBtnGroup">
                <button
                        @click="deviceStore.toggleMicroPhone()"
                >
                    <!--                    @mouseleave="(e) => hideSlider('input', e)"-->
                    <svg v-show="!deviceStore.noInput" width="20" height="20" viewBox="0 0 48 48" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor"
                              stroke-width="4"
                              stroke-linejoin="round"/>
                        <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23" stroke="currentColor"
                              stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                    <svg v-show="deviceStore.noInput" width="20" height="20" viewBox="0 0 48 48" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor"
                              stroke-width="4"
                              stroke-linejoin="round"/>
                        <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23" stroke="currentColor"
                              stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
                    </svg>
                </button>

                <div class="absolute pb-[23px] -translate-x-1/2 bottom-5 w-[720px] flex justify-center py-12">
                    <div class="ViewCard flex flex-col-reverse justify-around">

                        <a-slider
                                v-model="deviceStore.inputVolume"
                                :default-value="deviceStore.inputVolume"
                                :style="{ width: '135px' }"/>

                        <div class="divide my-3"></div>
                        <div class="flex flex-col space-y-4">
                            <div class="flex justify-between">
                                <div>
                                    语音设置
                                </div>
                                <svg width="18" height="18" viewBox="0 0 48 48" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 16V42" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M24 29V42" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M24 19V6" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M37 6V32" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path d="M11 16C13.7614 16 16 13.7614 16 11C16 8.23858 13.7614 6 11 6C8.23858 6 6 8.23858 6 11C6 13.7614 8.23858 16 11 16Z"
                                          fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                                    <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
                                          fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                                    <path d="M37 42C39.7614 42 42 39.7614 42 37C42 34.2386 39.7614 32 37 32C34.2386 32 32 34.2386 32 37C32 39.7614 34.2386 42 37 42Z"
                                          fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="flex justify-between">
                                语音降噪
                            </div>
                            <div class="flex justify-between">
                                拾音加强
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--音频输出-->
            <div class="relative voiceSettingBtnGroup">
                <button @click="deviceStore.toggleAudioOutput()">
                    <svg v-show="!deviceStore.noOutput" width="20" height="20" viewBox="0 0 48 48" fill="none"
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

                    <svg v-show="deviceStore.noOutput" width="20" height="20" viewBox="0 0 48 48" fill="none"
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
                <div class="absolute pb-[23px] -translate-x-1/2 bottom-5 w-[720px] flex justify-center py-12">
                    <div class="ViewCard flex flex-col-reverse">
                        <a-slider
                                v-model="deviceStore.outputVolume"
                                :default-value="deviceStore.outputVolume"
                                :style="{ width: '135px' }"

                        />
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup lang="ts">
import {useDevicesStore} from "@/pinia/deviceStore.ts";
import {onMounted} from "vue";
import {useCurUserState} from "../../../../pinia/curUserState.ts";
import {useToast} from "vue-toastification";
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
