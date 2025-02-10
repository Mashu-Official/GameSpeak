<template>
    <div class="sidebar flex flex-col items-center h-full justify-center absolute bottom-0 left-0">

        <div class="overflow-hidden">
            <!--搜索-->
            <div class="avatar" @mouseenter="showChannelName($event, '搜索')" @mouseleave="hideChannelName">
                <div class="avatarContainer flex justify-center items-center">
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z"
                              fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                        <path d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431"
                              stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M33.2216 33.2217L41.7069 41.707" stroke="currentColor" stroke-width="4"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>

            <div class="avatar" @mouseenter="showChannelName($event, '私信')" @mouseleave="hideChannelName">
                <div class="avatarContainer flex justify-center items-center">
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44.0001 24C44.0001 35.0457 35.0458 44 24.0001 44C18.0266 44 4.00006 44 4.00006 44C4.00006 44 4.00006 29.0722 4.00006 24C4.00006 12.9543 12.9544 4 24.0001 4C35.0458 4 44.0001 12.9543 44.0001 24Z"
                              fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M14 18L32 18" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M14 26H32" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M14 34H24" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>

        <div class="divide" style="width: 60%;"></div>


        <div v-show="isSidebarOpen" ref="parentContainerRef"
             class="sidebar flex flex-col items-center relative overflow-hidden select-none flex-1">

            <div class="channelsList flex flex-col overflow-y-scroll" ref="channelsListRef">
                <div class="avatar" v-for="channel in Channels" :key="channel.id"
                     @dblclick="curUserState.enterChannel(channel)"
                     @mouseenter="showChannelName($event, channel.name)"
                     @mouseleave="hideChannelName">

                    <div v-if="channel.avatarURL"
                         :class="{selectedAvatar : channel.id === curUserState.channel.id}"
                         class="avatarContainer">
                        <img class="object-cover w-full h-full " :src="channel.avatarURL" :alt="channel.avatarURL">
                    </div>

                    <div v-else
                         :class="{selectedAvatar : channel.id === curUserState.channel.id}"
                         class="avatarContainer flex flex-col justify-center items-center">
                        <div class="text-2xl font-bold">
                            {{ channel.name.slice(0, 1) }}
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="divide" style="width: 60%;"></div>

        <div v-if="true" class="flex justify-center items-center overflow-hidden w-[52px] h-[52px] mt-2 mb-4 circle cursor-pointer select-none relative"
        @click.stop="toggleSubMenu">
            <img class="object-cover w-full h-full"
                 src="https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img2e632b0f1be954a022bc8549a941107f.png" alt="">

        </div>

        <div v-else class="flex justify-center items-center overflow-hidden w-[52px] h-[52px] mt-2 mb-4 circle cursor-pointer select-none relative userAvatar"
             @click="router.push('/login')">
           <span class="text-xl font-bold">登录</span>
        </div>

        <SideSubMenu v-if="isOpenSubMenu" ref="subMenuElement" :isSidebarOpen="isSidebarOpen" @emit="handleToggle"/>
    </div>

</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {hideChannelName, showChannelName} from "../../../assets/js/channelName.ts";
import {useCurUserState} from "../../../pinia/curUserState.ts"
import { channelAttribute } from "../../../interface&enum/ChannelAttribute.ts";
import { RoomType } from "../../../interface&enum/RoomTypeEnum.ts";
import SideSubMenu from "./SideSubMenu.vue";
import {useToggleFlagStore} from "../../../pinia/toggleFlagStore.ts";
import router from "../../../router";
import { useToast } from 'vue-toastification';
import axiosReq from '../../../assets/js/axiosBase/axiosObject.js'

// 初始化 Toast
const toast = useToast();
// 控制侧边栏是否打开
const isSidebarOpen = ref<boolean>(true)
// 打开头像处的子菜单
const isOpenSubMenu = ref<boolean>(false)
const subMenuElement = ref<HTMLDivElement>();
const subMenuTrigger = ref<HTMLDivElement>()

const curUserState = useCurUserState()

const toggleSubMenu = () =>{
    isOpenSubMenu.value = !isOpenSubMenu.value
    document.addEventListener('click', handleClickOutside);
}
const handleToggle = (toggleSign)=>{
    isOpenSubMenu.value = toggleSign
}

const handleClickOutside = (event) => {
    if (useToggleFlagStore().subMenuLock){
        return
    }
    if ((event.target !== subMenuTrigger.value) || (event.target !== subMenuElement.value)){
        isOpenSubMenu.value = false  // document.removeEventListener('click', handleClickOutside);
    }
};

const Channels = reactive<channelAttribute[]>([])

const getChannel = async () => {
    try {
        const res = await axiosReq.get("/api/channels")
        Object.assign(Channels, res.data);
    } catch (err) {
        if (err.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(err.response.data); // 服务器返回的数据
            console.log(err.response.status); // HTTP 状态码
            console.log(err.response.headers); // 响应头

            if (err.response.status === 400){
                toast.error(err.response.data.message)
            }
        } else if (err.request) {
            // 请求已发出，但没有收到响应
            console.error('没有收到响应:', err.request);
            toast.error("网络错误，请稍后再试");
        } else {
            // 一些设置请求时发生错误
            console.error('Error', err.message);
            toast.error("请求错误，请联系管理员");
        }

    }
}
onMounted(async () =>{
    await getChannel()

});

onUnmounted(() => {

})

</script>

<style scoped>
.channelsList {
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge */
}

.channelsList::webkit-scrollbar {
    display: none; /* WebKit 浏览器 */
}

.avatar {
    cursor: pointer;
    --tw-bg-opacity: 1;
    transition: scale ease-in 0.18s;
    padding: 6px 12px;
    width: 100%;
}

.avatar > .avatarContainer {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    overflow: hidden;
    box-sizing: border-box;
    transition: transform 0.16s ease-in;
}

.avatar {
    transition: transform 0.2s ease-in;
}

.avatar:active > .avatarContainer {
    transform: scale(0.85);
}

.avatar > .avatarContainer:hover {
    transform: scale(1.08);
    transition: transform 0.16s ease-in
    /*scale: 110%;*/
}

.selectedAvatar {
    border: solid rgb(62 62 68 / var(--tw-bg-opacity)) 2px;
}

:is(.dark .selectedAvatar) {
    --tw-bg-opacity: 1;
    border: solid rgb(227 227 227 / var(--tw-bg-opacity)) 2px;
}

.sidebar {
    /*transition: transform 0.3s ease-out;*/
}

.userAvatar{
    --tw-bg-opacity: 1;
    background-color: rgb(28 28 32 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(240 244 246 / var(--tw-text-opacity));
}

:is(.dark .userAvatar){
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(55 65 81 / var(--tw-text-opacity));
}
</style>

<!--            <div class="avatar"-->
<!--                 @click="toggleSideBar"-->
<!--                 @mouseenter="showServerName($event, '收起侧栏')"-->
<!--                 @mouseleave="hideServerName">-->
<!--                <div class="avatarContainer flex justify-center items-center">-->
<!--                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                        <circle cx="12" cy="24" r="3" fill="currentColor"/>-->
<!--                        <circle cx="24" cy="24" r="3" fill="currentColor"/>-->
<!--                        <circle cx="36" cy="24" r="3" fill="currentColor"/>-->
<!--                    </svg>-->
<!--                </div>-->
<!--            </div>-->
<!--        <div class="avatar" @mouseenter="showServerName($event, '施工中')" @mouseleave="hideServerName">-->
<!--            <div class="avatarContainer flex justify-center items-center">-->
<!--                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                    <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"-->
<!--                          fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>-->
<!--                    <path d="M31 18V19" stroke="currentColor" stroke-width="4" stroke-linecap="round"-->
<!--                          stroke-linejoin="round"/>-->
<!--                    <path d="M17 18V19" stroke="currentColor" stroke-width="4" stroke-linecap="round"-->
<!--                          stroke-linejoin="round"/>-->
<!--                    <rect x="15" y="28" width="18" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="4"-->
<!--                          stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                </svg>-->
<!--            </div>-->
<!--        </div>-->