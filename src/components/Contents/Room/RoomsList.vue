<template>

    <div class="flex flex-col overflow-x-hidden overflow-y-hidden flex-shrink-0
  min-w-[255px] max-w-[345px]
     select-none">

        <div>
            <div class="flex flex-row justify-between items-center px-4 relative">
                <div class="text-xl">
                    {{ curUserState.server.name || '找不到该服务器' }}
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

<!--             <ListCard_behavior/>--> cv
                <div class="divide"></div>
            </div>
        </div>

        <div class="roomList">

            <div class="m-0 p-0 relative text-sm px-4 h-0 flex-1">
                <!--房间列表-->
                <div v-for="room in state.roomsList" :key="room.id" class="roomItem px-3 py-1.5 cursor-pointer mb-[2px]"
                     @dblclick="curUserState.enterRoom(room)">

                    <div class="flex flex-row items-center">
                        <!--文字-->
                        <svg v-if="room.type === 'Text'" width="22" height="22" viewBox="0 0 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M33 38H22V30H36V22H44V38H39L36 41L33 38Z" stroke="currentColor" stroke-width="3"
                                  stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 6H36V30H17L13 34L9 30H4V6Z" fill="none" stroke="currentColor" stroke-width="3"
                                  stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19 18H20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                            <path d="M26 18H27" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                            <path d="M12 18H13" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                        </svg>
                        <!--语音-->
                        <svg v-else-if="room.type === 'Voice'" width="22" height="22" viewBox="0 0 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 6V42C17 42 11.7985 32.8391 11.7985 32.8391H6C4.89543 32.8391 4 31.9437 4 30.8391V17.0108C4 15.9062 4.89543 15.0108 6 15.0108H11.7985C11.7985 15.0108 17 6 24 6Z"
                                  fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                            <path d="M32 15L32 15C32.6232 15.5565 33.1881 16.1797 33.6841 16.8588C35.1387 18.8504 36 21.3223 36 24C36 26.6545 35.1535 29.1067 33.7218 31.0893C33.2168 31.7885 32.6391 32.4293 32 33"
                                  stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                        <!--文字语音-->
                        <svg v-else-if="room.type === 'Both'" width="22" height="22" viewBox="0 0 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 30C4 36.6274 9.37258 42 16 42C22.6274 42 26 38 27 35L28.5385 30L35 9L44 42"
                                  stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                            <path d="M40.7274 30H28.5386" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                            <path d="M22 15C22 11.6863 19.3137 9 16 9C12.6863 9 10 11.6863 10 15V30C10 33.3137 12.6863 36 16 36C19.3137 36 22 33.3137 22 30V15Z"
                                  fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                        <span class="whitespace-nowrap ml-2 py-2 font-semibold">{{ room.name }}</span>
                    </div>

                    <span class="text-xs">{{ room.curMemberNum }}/{{ room.memberLimit }}</span>
                </div>
            </div>
        </div>


        <VoiceSetting/>
        <CreateRoom v-model="isOpenModal" @submit="handleSubmit"/>

    </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {setHeightWithCalc} from '../../../assets/js/dynamticOverflow.js'
import CreateRoom from "./ListComponets/CreateRoom.vue";

import {RoomType} from "../../../interface/RoomTypeEnum.ts";
import {RoomsList} from "../../../interface/RoomsList.ts";

import {useCurUserState} from "../../../pinia/curUserState.js";

import VoiceSetting from "./ListComponets/VoiceSetting.vue";
import ListCard_behavior from "./ListComponets/ListCard_behavior.vue";


const curUserState = useCurUserState()
const isOpenModal = ref(false);

onMounted(async () => {
    await nextTick();
    // await setHeightWithCalc(roomListRef, parentContainerRef)
    state.roomsList = [
        {
            id: 1,
            name: "文字聊天室",
            type: RoomType.Text,
            curMemberNum: 15,
            memberLimit: 50
        },
        {
            id: 1,
            name: "语音",
            type: RoomType.Voice,
            curMemberNum: 15,
            memberLimit: 50
        },
    ]
});

const state = reactive<{ roomsList: RoomsList[] }>({
    roomsList: []
})

const handleSubmit = (formData) => {
    // console.log(formData)
    const temp = {
        id: 1,
        name: formData.roomName,
        type: formData.type,
        curMemberNum: 15,
        memberLimit: 50
    }
    state.roomsList.push(temp)

}

const enterRoom = (room) => {
    curSelectedState.room = room
}

</script>

<style scoped>
.roomList {
    overflow-y: scroll;
    flex: 1;
    flex-shrink: 0;
}

.roomItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.75rem;
    transition: background-color ease-in-out 0.15s;
}

.roomItem:hover {
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

:is(.dark .roomItem:hover) {
    background-color: rgb(28 28 32 / var(--tw-bg-opacity));
}

.roomItem_Active {
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

:is(.dark .roomItem_Active) {
    background-color: rgb(28 28 32 / var(--tw-bg-opacity));
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