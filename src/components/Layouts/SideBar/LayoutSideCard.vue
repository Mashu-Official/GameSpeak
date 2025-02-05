<template>
    <transition name="slide">
        <div v-show="!isSidebarOpen" class="flex flex-col justify-center items-center h-full relative sidebar" @mouseenter="showServerName($event, '收起侧栏')"
             @mouseleave="hideServerName"
             @click="toggleSideBar">

            <!--TODO 动画待修改-->
            <div class="flex flex-col justify-center items-center h-16 select-none px-2 py-auto">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 11H40" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M8 24H42" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M8 37H40" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M36.3433 29.6568L42.0001 23.9999L36.3433 18.343" stroke="currentColor" stroke-width="4"
                          stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

        </div>
    </transition>
    <transition name="slide">
        <div v-show="isSidebarOpen"
             class="sidebar flex flex-col items-center h-full relative py-2 overflow-hidden select-none">
            <div class="avatar"
                 @click="toggleSideBar"
                 @mouseenter="showServerName($event, '收起侧栏')"
                 @mouseleave="hideServerName">
                <div class="avatarContainer flex justify-center items-center">
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="24" r="3" fill="currentColor"/>
                        <circle cx="24" cy="24" r="3" fill="currentColor"/>
                        <circle cx="36" cy="24" r="3" fill="currentColor"/>
                    </svg>
                </div>
            </div>
            <div class="avatar" @mouseenter="showServerName($event, '搜索')" @mouseleave="hideServerName">
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
            <div class="avatar" @mouseenter="showServerName($event, '私信')" @mouseleave="hideServerName">
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
            <div class="divide" style="width: 60%;"></div>

            <div class="serverList flex flex-col overflow-y-scroll h-[372px]">
                <div class="avatar" v-for="server in state.servers" :key="server.id"
                     @click="enterServer(server)"
                     @mouseenter="showServerName($event, server.name)"
                     @mouseleave="hideServerName">

                    <div v-if="server.avatarURL"
                         :class="{selectedAvatar : server.id === curSelectedState.server.id}"
                         class="avatarContainer avatarContainer_">
                        <img class="object-cover w-full h-full " :src="server.avatarURL" :alt="server.avatarURL">
                    </div>

                    <div v-else
                         :class="{selectedAvatar : server.id === curSelectedState.server.id}"
                         class="avatarContainer flex flex-col justify-center items-center">
                        <div class="text-2xl font-bold">
                            {{ server.name.slice(0, 1) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="overflow-hidden w-[52px] h-[52px] absolute bottom-4 circle cursor-pointer" style="    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));">
                <img class="object-cover w-full h-full"
                     src="https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon" alt="">
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import router from "../../../router";
import {hideServerName, showServerName} from "../../../assets/js/serverName.ts";
import {useCurSelectedState} from "../../../pinia/curSelectedState.js"

// 控制侧边栏是否打开
const isSidebarOpen = ref(true);

const curSelectedState = useCurSelectedState()

// 切换侧边栏状态的方法
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

interface serverAttribute {
    id: number, // optional
    name: string,
    hashID: string,
    avatarURL: string,
}

const state = reactive<{ servers: serverAttribute[] }>({
    servers: [],
})
state.servers = [
    {
        id: 1,
        name: "豪华海景房",
        hashID: "1234",
        avatarURL: "https://ts3.cn.mm.bing.net/th?id=ORMS.d61fa58d01c4d56bd9e5bc4695579c84&pid=Wdp&w=268&h=140&qlt=90&c=1&rs=1&dpr=1&p=0"
    },
    {
        id: 2,
        name: "标准双人房",
        hashID: "1263",
        avatarURL: "https://ts3.cn.mm.bing.net/th?id=ORMS.d61fa58d01c4d56bd9e5bc4695579c84&pid=Wdp&w=268&h=140&qlt=90&c=1&rs=1&dpr=1&p=0"
    },
    {
        id: 3,
        name: "总统套房",
        hashID: "123",
        avatarURL: "https://ts3.cn.mm.bing.net/th?id=ORMS.d61fa58d01c4d56bd9e5bc4695579c84&pid=Wdp&w=268&h=140&qlt=90&c=1&rs=1&dpr=1&p=0"
    },
    {
        id: 4,
        name: "总统套房",
        hashID: "123",
        avatarURL: ""
    },
];

const InitState: () => void = () => {

}

const enterServer: (server) => void = (server) => {
    curSelectedState.server = server
    router.push(`/server/${server.hashID}`)
}

const toggleSideBar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
}

</script>

<style scoped>
.serverList {
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge */
}

.serverList::webkit-scrollbar {
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
    box-sizing: content-box;
    transition: transform 0.16s ease-in;
}

.avatar{
    transition: transform 0.18s ease-in;
}

.avatar:active > .avatarContainer {
  transform: scale(0.8);
}
.avatar > .avatarContainer:hover {
    transform: scale(1.08);
    transition: transform 0.16s ease-in
    /*scale: 110%;*/
}
.selectedAvatar {
    border: solid rgb(62 62 68 / var(--tw-bg-opacity)) 2px;
}
:is(.dark .selectedAvatar){
    --tw-bg-opacity: 1;
    border: solid rgb(227 227 227 / var(--tw-bg-opacity)) 2px;
}
.divide {
    margin: 6px 0;
    border-width: 1px;
}

.sidebar {
    /*transition: transform 0.3s ease-out;*/
}

/* 定义进入和离开时的过渡效果 */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}
</style>