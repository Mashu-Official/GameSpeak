<template>
    <div class="flex flex-row justify-between ViewCard items-center px-4 py-3 voiceSettingCard mb-3 mx-2">
        <button>
            <span>{{ deviceStore.pressToSpeak ? '按键发言' : '自由发言' }}</span>
        </button>

        <div class="flex flex-row space-x-4">
            <!--音频输入-->
            <button
                    @click="deviceStore.toggleMicroPhone()"
                    @mouseenter.stop="(e) => displaySlider('input', e)"
                    ref="inputButton"
            >
                <!--                    @mouseleave="(e) => hideSlider('input', e)"-->
                <svg v-show="deviceStore.inputVolume !== 0" width="20" height="20" viewBox="0 0 48 48" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor" stroke-width="4"
                          stroke-linejoin="round"/>
                    <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23" stroke="currentColor"
                          stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
                <svg v-show="deviceStore.inputVolume === 0" width="20" height="20" viewBox="0 0 48 48" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor" stroke-width="4"
                          stroke-linejoin="round"/>
                    <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23" stroke="currentColor"
                          stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
                </svg>
            </button>

            <!--音频输出-->
            <button
                    @click="deviceStore.toggleAudioOutput()"
                    @mouseenter="displaySlider('output')"
                    ref="outputButton"
            >
                <svg v-show="deviceStore.outputVolume !== 0" width="20" height="20" viewBox="0 0 48 48" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                          stroke="currentColor"
                          stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z" fill="none"
                          stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                    <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                          fill="currentColor"/>
                    <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z" fill="currentColor"/>
                    <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z" fill="none"
                          stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                </svg>

                <svg v-show="deviceStore.outputVolume === 0" width="20" height="20" viewBox="0 0 48 48" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                          stroke="currentColor"
                          stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z" fill="none"
                          stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                    <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                          fill="currentColor"/>
                    <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z" fill="currentColor"/>
                    <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z" fill="none"
                          stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                    <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
                </svg>
            </button>
        </div>
    </div>

    <div
            class="absolute z-50 opacity-0 invisible pb-[25px]"
            ref="inputVolumeRef"
    >
        <div class="ViewCard">
            <a-slider :default-value="50" :style="{ width: '135px' }"/>
        </div>
    </div>

    <div
            class="absolute z-50 opacity-0 invisible pb-[25px]"
            ref="outputVolumeRef"
    >
        <div class="ViewCard">
            <a-slider :style="{ width: '135px' }" :default-value="5"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDevicesStore } from "@/pinia/deviceStore.ts";
import { h, nextTick, onMounted, ref } from "vue";

const deviceStore = useDevicesStore();

const outputVolumeRef = ref();
const inputVolumeRef = ref();
const inputButton = ref();
const outputButton = ref();

onMounted(async () => {
    await nextTick();
    slidePosition(outputButton, outputVolumeRef);
    slidePosition(inputButton, inputVolumeRef);

    addEventListener("resize", () => {
        slidePosition(outputButton, outputVolumeRef);
        slidePosition(inputButton, inputVolumeRef);
    });

});

const slidePosition = (buttonRef, sliderRef) => {
    const buttonRect = buttonRef.value.getBoundingClientRect();
    const volumeElement = sliderRef.value;
    const volumeHeight = parseFloat(volumeElement.style.height) || volumeElement.offsetHeight;
    volumeElement.style.left = `${buttonRect.left + 4 - volumeElement.offsetWidth / 2}px`;
    volumeElement.style.top = `${buttonRect.top - volumeHeight}px`;
};
let lastMouseY = 0; // 上次鼠标的 Y 坐标
const displaySlider = (buttonFunc, e) => {
    console.log(e)
    if (buttonFunc === "output") {
        outputVolumeRef.value.classList.remove("opacity-0", "invisible");
    }
    if (buttonFunc === "input") {
        inputVolumeRef.value.classList.remove("opacity-0", "invisible");
    }
    addEventListener('mouseover',(e)=>hideSlider(e,buttonFunc))
};

const hideSlider = (e, buttonFunc) => {
    console.log((e.target !== outputVolumeRef.value) && (e.target !== outputButton.value))

    if((e.target !== inputVolumeRef.value) && (e.target !== inputButton.value)){
            inputVolumeRef.value.classList.add("opacity-0", "invisible");
        }

    if ((e.target !== outputVolumeRef.value) && (e.target !== outputButton.value)) {
        outputVolumeRef.value.classList.add("opacity-0", "invisible");
    }
};

// Mouseleave listener should be on buttons and sliders
// const setupMouseEvents = (buttonFunc) => {
//     const button = buttonFunc === "output" ? outputButton.value : inputButton.value;
//     const slider = buttonFunc === "output" ? outputVolumeRef.value : inputVolumeRef.value;
//
//     button.addEventListener("mouseleave", (e) => hideSlider(buttonFunc, e));
//     slider.addEventListener("mouseleave", (e) => hideSlider(buttonFunc, e));
// };

// onMounted(() => {
//     setupMouseEvents("output");
//     setupMouseEvents("input");
// });
</script>


<style scoped>
.voiceSettingCard {
    border-radius: 1rem;
    border: 2px solid #6e6d6d;
}

</style>
