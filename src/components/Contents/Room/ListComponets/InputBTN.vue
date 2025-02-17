<template>
    <div class="relative voiceSettingBtnGroup">
        <button v-if="state === 'self' "
                @click="useDevicesStore().toggleMicroPhone()"
        >
            <!--                    @mouseleave="(e) => hideSlider('input', e)"-->
            <svg v-show="!useDevicesStore().noInput" width="20" height="20" viewBox="0 0 48 48" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor"
                      stroke-width="4"
                      stroke-linejoin="round"/>
                <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23" stroke="currentColor"
                      stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
            <svg v-show="useDevicesStore().noInput" width="20" height="20" viewBox="0 0 48 48" fill="none"
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

        <div class="absolute -translate-x-1/2 w-[640px] flex justify-center py-6"
             :class="{
                   'pb-[23px] bottom-5': displayPosition === 'top',
                  'pt-[23px] top-5': displayPosition === 'bottom'
                }"
        >
            <div class="ViewCard flex justify-around"
                 :class="{
                    'flex-col-reverse': displayPosition === 'top',
                  'flex-col': displayPosition === 'bottom'
                }"
            >

                <a-slider
                        v-model="inputVolume"
                        :default-value="inputVolume"
                        :style="{ width: '135px' }"/>

                <div class="divide "
                     :class="{
                        'mb-3': displayPosition === 'top',
                        'mt-3': displayPosition === 'bottom'
                }"></div>
                <div class="flex settingList"
                     :class="{
                      'flex-col': displayPosition === 'top',
                      'flex-col-reverse': displayPosition === 'bottom'
                }">
                    <div class="p-2 rounded-lg">
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
                    <div class="p-2 rounded-lg">
                        语音降噪
                    </div>
                    <div class="p-2 rounded-lg">
                        拾音加强
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDevicesStore} from "../../../../pinia/deviceStore.ts";
import {onMounted, ref, watch} from "vue";
import {useToast} from "vue-toastification";

const toast = useToast()

const props = defineProps<{
    state: string
    displayPosition: string
}>()

const inputVolume = ref<number>(useDevicesStore().inputVolume)

if (props.state === 'self') {
    const deviceStore = useDevicesStore()

    watch(() => deviceStore.inputVolume, (newVal) => {
        inputVolume.value = newVal;
    });
    watch(() => inputVolume.value, (newVal) => {
        deviceStore.inputVolume = newVal;
    });
} else {
    inputVolume.value = 1
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

.settingList > div {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
}

.settingList > div:hover {
    background-color: var(--dark-card-color);
}
</style>