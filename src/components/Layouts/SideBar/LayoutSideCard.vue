<template>
    <div class="sidebar flex flex-col items-center h-full justify-center absolute bottom-0 left-0">

        <div class="overflow-hidden">
            <!--搜索-->
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
        </div>

        <div class="divide" style="width: 60%;"></div>


        <div v-show="isSidebarOpen" ref="parentContainerRef"
             class="sidebar flex flex-col items-center relative overflow-hidden select-none flex-1">

            <div class="serverList flex flex-col overflow-y-scroll" ref="serverListRef">
                <div class="avatar" v-for="server in state.servers" :key="server.id"
                     @dblclick="curSelectedState.enterServer(server)"
                     @mouseenter="showServerName($event, server.name)"
                     @mouseleave="hideServerName">

                    <div v-if="server.avatarURL"
                         :class="{selectedAvatar : server.id === curSelectedState.server.id}"
                         class="avatarContainer">
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

        </div>

        <div class="divide" style="width: 60%;"></div>

        <div class="flex justify-center items-center overflow-hidden w-[52px] h-[52px] mt-2 mb-4 circle cursor-pointer select-none relative"
        @click.stop="toggleSubMenu">
            <img class="object-cover w-full h-full"
                 src="https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img2e632b0f1be954a022bc8549a941107f.png" alt="">

        </div>
        <SideSubMenu v-if="isOpenSubMenu" ref="subMenuElement" :isSidebarOpen="isSidebarOpen" @emit="handleToggle"/>
    </div>

</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {hideServerName, showServerName} from "../../../assets/js/serverName.ts";
import {useCurUserState} from "../../../pinia/curUserState.ts"
import {serverAttribute} from "../../../interface&enum/ServerAttribute.ts";
import {RoomType} from "../../../interface&enum/RoomTypeEnum.ts";
import SideSubMenu from "./SideSubMenu.vue";

// 控制侧边栏是否打开
const isSidebarOpen = ref<boolean>(true)
// 打开头像处的子菜单
const isOpenSubMenu = ref<boolean>(false)
const subMenuElement = ref<HTMLDivElement>();
const subMenuTrigger = ref<HTMLDivElement>()

const curSelectedState = useCurUserState()

const toggleSubMenu = () =>{
    isOpenSubMenu.value = !isOpenSubMenu.value
    // document.addEventListener('click', handleClickOutside);
}
const handleToggle = (toggleSign)=>{
    isOpenSubMenu.value = toggleSign
}

const handleClickOutside = (event) => {
    if ((event.target !== subMenuTrigger.value) || (event.target !== subMenuElement.value)){
        isOpenSubMenu.value = false
        // document.removeEventListener('click', handleClickOutside);
    }
};

const state = reactive<{ servers: serverAttribute[] }>({
    servers: [],
})
state.servers = [
    {
        id: 1,
        name: "豪华海景房",
        hashID: "1234",
        avatarURL: "https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img/吧唧2.png"
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

onMounted(async () => {

});

onUnmounted(() => {

})

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