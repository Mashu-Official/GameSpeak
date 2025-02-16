<template>
    <div class="flex flex-col items-start absolute SubMenuCard ViewCard left-2 bottom-8 mb-16 z-50 w-[305px] select-none">

        <div class="flex flex-row justify-between items-start w-full">
            <div class="w-16 h-16 circle overflow-hidden ml-2">
                <img class="object-cover w-full h-full circle"
                     :src="curUserState.userInfo.avatar"
                     alt="">
            </div>

            <svg @click="toggleSubMenu" class="cursor-pointer"
                    width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8L40 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 40L40 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

        </div>
        <div class="flex flex-col w-full whitespace-nowrap my-1 mb-2 ml-2">
            <span class="text-lg font-semibold">{{ curUserState.userInfo.name }}</span>
        </div>

        <div class="flex flex-col w-full space-y-1">
            <div @click="openDrawer('VoiceSetting')"
                 class="flex flex-row space-x-2 items-center px-2 py-1 subMenuItem rounded-lg">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                          fill="none" stroke="currentColor" stroke-width="4"/>
                    <path d="M30 18V30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                    <path d="M36 22V26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                    <path d="M18 18V30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                    <path d="M12 22V26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                    <path d="M24 14V34" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                </svg>
                <span class="whitespace-nowrap">
                      语音设置
                </span>
            </div>

            <div @click="openDrawer('WebSetting')"
                 class="flex flex-row space-x-2 items-center px-2 py-1 subMenuItem rounded-lg">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.2838 43.1713C14.9327 42.1736 11.9498 40.3213 9.58787 37.867C10.469 36.8227 11 35.4734 11 34.0001C11 30.6864 8.31371 28.0001 5 28.0001C4.79955 28.0001 4.60139 28.01 4.40599 28.0292C4.13979 26.7277 4 25.3803 4 24.0001C4 21.9095 4.32077 19.8938 4.91579 17.9995C4.94381 17.9999 4.97188 18.0001 5 18.0001C8.31371 18.0001 11 15.3138 11 12.0001C11 11.0488 10.7786 10.1493 10.3846 9.35011C12.6975 7.1995 15.5205 5.59002 18.6521 4.72314C19.6444 6.66819 21.6667 8.00013 24 8.00013C26.3333 8.00013 28.3556 6.66819 29.3479 4.72314C32.4795 5.59002 35.3025 7.1995 37.6154 9.35011C37.2214 10.1493 37 11.0488 37 12.0001C37 15.3138 39.6863 18.0001 43 18.0001C43.0281 18.0001 43.0562 17.9999 43.0842 17.9995C43.6792 19.8938 44 21.9095 44 24.0001C44 25.3803 43.8602 26.7277 43.594 28.0292C43.3986 28.01 43.2005 28.0001 43 28.0001C39.6863 28.0001 37 30.6864 37 34.0001C37 35.4734 37.531 36.8227 38.4121 37.867C36.0502 40.3213 33.0673 42.1736 29.7162 43.1713C28.9428 40.752 26.676 39.0001 24 39.0001C21.324 39.0001 19.0572 40.752 18.2838 43.1713Z"
                          fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                    <path d="M24 31C27.866 31 31 27.866 31 24C31 20.134 27.866 17 24 17C20.134 17 17 20.134 17 24C17 27.866 20.134 31 24 31Z"
                          fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                </svg>
                <span class="whitespace-nowrap">
                    管理设置
                </span>
            </div>
        </div>
    </div>

    <a-drawer
            :width="targetSettingPage === whichSettingPage['VoiceSetting'] ? 540 : 860 "
            :footer="false"
            :visible="isOpenDrawer"
            popup-container="#parentNode"
            @cancel="closeDrawer()"
            :esc-to-close="true"
            unmountOnClose
            ref="DrawerRef"
    >
        <VoiceSetting v-if="targetSettingPage == whichSettingPage['VoiceSetting']"/>
        <WebSetting v-if="targetSettingPage == whichSettingPage['WebSetting']"/>

        <template #header>
            <div class="flex flex-row justify-between items-center w-full">
                <div class="text-xl font-bold">{{ targetSettingPage == whichSettingPage['VoiceSetting'] ? "语音设置" : "网页设置" }}</div>
                <HeaderButton />
            </div>
        </template>

    </a-drawer>
</template>

<script setup lang="ts">
import {ref} from "vue";
import VoiceSetting from "../../Contents/Setting/VoiceSetting.vue";
import WebSetting from "../../Contents/Setting/WebSetting.vue";
import {useToggleFlagStore} from "../../../pinia/toggleFlagStore.ts";
import HeaderButton from "../../Contents/Setting/Components/HeaderButton.vue";
import {useCurUserState} from "../../../pinia/curUserState.ts";

const props = defineProps<{
    isOpenSubMenu: boolean;
}>()
const emit = defineEmits(['emit'])
const curUserState = useCurUserState()

const isOpenDrawer = ref(false);
const custom = ref([])
const toggleSubMenu = ()=>{
    emit('emit', props.isOpenSubMenu)
}
enum whichSettingPage {
    WebSetting = "WebSetting",
    VoiceSetting = "VoiceSetting"
}

const targetSettingPage = ref<whichSettingPage | null>(null)
const openDrawer = (targetPage) => {
    // console.log(targetPage)
    targetSettingPage.value = whichSettingPage[targetPage]
    useToggleFlagStore().subMenuLock = true
    isOpenDrawer.value = true;
};
const saveSetting = () => {
    isOpenDrawer.value = false;
};
const closeDrawer = () => {
    isOpenDrawer.value = false;
    setTimeout(()=>{
        useToggleFlagStore().subMenuLock = false
    },100)
}
</script>

<style scoped>
.SubMenuCard {
    border: dashed rgb(28 28 32 / var(--tw-bg-opacity)) 2px;
}

:is(.dark .SubMenuCard) {
    border: dashed rgb(255 255 255 / var(--tw-bg-opacity)) 2px;
}

.subMenuItem {

}

.subMenuItem:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(243 243 243 / var(--tw-bg-opacity));
}

:is(.dark .subMenuItem:hover) {
    --tw-bg-opacity: 1;
    background-color: rgb(48 48 48 / var(--tw-bg-opacity));
}


</style>
<style>
.arco-drawer-body{
    overflow-y: auto;
}
/* 设置滚动条的宽度 */
.arco-drawer-body::-webkit-scrollbar {
    width: 4px;
    display: block;
}

/* 设置滚动条的背景 */
.arco-drawer-body::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
}

:is(.dark .arco-drawer-body)::-webkit-scrollbar-track {
    background: #a2a2a2;
    border-radius: 10px;
}

/* 设置滚动条的滑块 */
.arco-drawer-body::-webkit-scrollbar-thumb {
    background: #323232;
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

:is(.dark .arco-drawer-body)::-webkit-scrollbar-thumb {
    background: #ffffff; /* 滚动条滑块的颜色 */
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

.arco-drawer-body::-webkit-scrollbar-thumb:hover {
    background: #464646
}

.ViewCard .arco-drawer-body::-webkit-scrollbar-corner {
    background: #f1f1f1;
}
</style>