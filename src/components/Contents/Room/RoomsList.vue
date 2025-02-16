<template>
    <div class="flex flex-col flex-shrink-0 min-w-[268px] max-w-[345px] select-none px-1 pt-6 box-border border-r-2 border-white">

        <div>
            <div class="flex flex-row justify-between items-center px-4 relative">
                <div class="text-xl">
                    {{ curUserState.channel.name || '找不到该服务器' }}
                </div>
                <button class="" @click="" title="设置">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M34.0003 41L44 24L34.0003 7H14.0002L4 24L14.0002 41H34.0003Z" fill="none"
                              stroke="currentColor"
                              stroke-width="4" stroke-linejoin="round"/>
                        <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
                              fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                    </svg>
                </button>

            </div>

            <div class="px-4">
                <div class="divide"></div>

                <div class="card ViewCard my-4">
                </div>

<!--             <ListCard_behavior/>-->
                <div class="divide"></div>
            </div>
        </div>

        <div class="roomList">

            <div class="m-0 p-0 relative text-sm px-4 h-0 flex-1">
                <!--房间列表-->
                <RoomListItem />
            </div>
        </div>

        <VoiceSetting/>
<!--        <CreateRoom v-model="isOpenModal" @submit="handleSubmit"/>-->

    </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";

import CreateRoom from "./ListComponets/CreateRoom.vue";
import {useCurUserState} from "../../../pinia/curUserState.ts";
import VoiceSetting from "./ListComponets/VoiceSetting.vue";
import {useRoute} from "vue-router";
import RoomListItem from "./ListComponets/RoomListItem.vue";

const route = useRoute()
const curUserState = useCurUserState()

const isOpenModal = ref(false);



</script>

<style scoped>
.roomList {
    overflow-y: auto;
    flex: 1;
    flex-shrink: 0;
}

/* 设置滚动条的宽度 */
.roomList::-webkit-scrollbar {
    width: 3px;
    display: block;
}

/* 设置滚动条的背景 */
.roomList::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
}

:is(.dark .roomList)::-webkit-scrollbar-track {
    background: #a2a2a2;
    border-radius: 10px;
}

/* 设置滚动条的滑块 */
.roomList::-webkit-scrollbar-thumb {
    background: #a2a2a2;
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

:is(.dark .roomList)::-webkit-scrollbar-thumb {
    background: #ffffff; /* 滚动条滑块的颜色 */
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

.roomList::-webkit-scrollbar-thumb:hover {
    background: #464646
}

.roomList::-webkit-scrollbar-corner {
    background: #f1f1f1;
}
</style>