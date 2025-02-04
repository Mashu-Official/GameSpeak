<template>
    <div class="sidebar flex flex-col items-center h-full relative py-2 overflow-hidden select-none">

        <div class="avatar" @mouseenter="showServerName($event, '私信')" @mouseleave="hideServerName">
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
        <div class="avatar" @mouseenter="showServerName($event, '搜索')" @mouseleave="hideServerName">
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
        <div class="avatar" @mouseenter="showServerName($event, '施工中')" @mouseleave="hideServerName">
            <div class="avatarContainer flex justify-center items-center">

                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 11C14.6112 11 7 18.8147 7 28.4545V35H41V28.4545C41 18.8147 33.3888 11 24 11Z"
                          fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="4" y="35" width="40" height="6" fill="none" stroke="currentColor" stroke-width="3.5"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="21" y="6" width="6" height="18" fill="none" stroke="currentColor" stroke-width="3.5"
                          stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>

        <div class="divide" style="width: 60%;"></div>

        <div class="serverList flex flex-col overflow-y-scroll h-[372px]">
            <div class="avatar" v-for="server in state.servers" :key="server.id" @mouseenter="showServerName($event, server.name)"
                 @mouseleave="hideServerName">
                <div class="avatarContainer" v-if="server.avatarURL" @click="enterserver(server.hashID)">
                    <img class="object-cover w-full h-full " :src="server.avatarURL" :alt="server.avatarURL">
                </div>
                <div v-else class="avatarContainer flex flex-col justify-center items-center">
                    <div class="text-2xl font-bold">
                        {{ server.name.slice(0, 1) }}
                    </div>
                </div>
            </div>
        </div>

        <div class="overflow-hidden w-[52px] h-[52px] absolute bottom-4 circle" style="    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));">
            <img class="object-cover w-full h-full" src="https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";

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
        hashID: "123",
        avatarURL: "https://ts3.cn.mm.bing.net/th?id=ORMS.d61fa58d01c4d56bd9e5bc4695579c84&pid=Wdp&w=268&h=140&qlt=90&c=1&rs=1&dpr=1&p=0"
    },
    {
        id: 2,
        name: "标准双人房",
        hashID: "123",
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

const enterServer: (serverHashID) => void = () => {

}

let serverNameElement = ref<HTMLElement | null>(null);

function showServerName(event: MouseEvent, serverName: string) {
    if (!serverNameElement.value) {
        serverNameElement.value = document.createElement('div');
        serverNameElement.value.classList.add('serverName');
        document.body.appendChild(serverNameElement.value);
    }
    serverNameElement.value.textContent = serverName;
    const avatarElement = event.currentTarget as HTMLElement;
    const avatarRect = avatarElement.getBoundingClientRect();

    // 设置.serverName的高度
    serverNameElement.value.style.height = `${avatarRect.height / 2}px`;
    // 计算.serverName的位置，使其位于.avatar的右侧并垂直居中
    serverNameElement.value.style.left = `${avatarRect.right + window.scrollX + 8}px`;
    serverNameElement.value.style.top = `${avatarRect.top + window.scrollY + (avatarRect.height - parseInt(serverNameElement.value.style.height)) / 2}px`;

    serverNameElement.value.style.opacity = '1';
}

function hideServerName() {
    if (serverNameElement.value) {
        serverNameElement.value.style.opacity = '0';
        if (serverNameElement.value) {
            serverNameElement.value.remove();
            serverNameElement.value = null;
        }
    }
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
    box-sizing: border-box;
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
    transition: scale ease-in 0.18s;
}

.avatar > .avatarContainer:hover {
    scale: 110%;
}

.selectedAvatar {
    border: solid blue 2px;
    /*   selected 直接内联 */
}

.divide {
    margin: 6px 0;
    border-width: 1px;

}

</style>