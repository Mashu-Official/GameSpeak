<template>
    <div class="mb-[2px]" v-for="room in channelState.roomList" :key="room.id">
        <div class="roomItem px-3 py-1.5 cursor-pointer mb-[4px]" :class="{ 'roomItem_Active' : curUserState.room.id === room.id}"
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
                <!--文字语音  废用-->
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

            <span class="text-xs">{{ room.curMemberNum }}/{{ room.maximum }}</span>

        </div>
        <template v-for="item in channelState.roomsMember">
            <div class="ml-6 userItem cursor-pointer" v-if="room.id === item.roomID" v-for="user in item.users">
                <div class="px-4 py-1.5 flex justify-between items-center">
                    <div class="w-6 h-6">
                        <img class="w-full h-full object-center object-cover circle"
                             :src="user.avatar"
                             alt="">
                    </div>
                    <div class="">
                        {{ user.name }}
                    </div>
                    <div class="">

                    </div>
                </div>
            </div>

        </template>

    </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";

import CreateRoom from "/CreateRoom.vue";

import {RoomType} from "../../../../interface&enum/RoomTypeEnum.ts";
import {Room} from "../../../../interface&enum/Room.ts";

import {useCurUserState} from "../../../../pinia/curUserState.ts";

import VoiceSetting from "./VoiceSetting.vue";
import axiosReq from "../../../../assets/js/axiosBase/axiosObject.js";
import {useRoute} from "vue-router";
import {useChannelState} from "../../../../pinia/ChannelState.ts";

const route = useRoute()
const curUserState = useCurUserState()
const channelState = useChannelState()
const isOpenModal = ref(false);



onMounted(async () => {
    await channelState.getRoomList(`/api/channel/${route.params.hashID}`)
});

watch(() => route.params.hashID, async (newHashID) => {
    if (newHashID) {
        await channelState.getRoomList(`/api/channel/${route.params.hashID}`)
    }
}, { immediate: true }); // 立即执行一次监听器

// const roomMember = channelState.roomsMember.filter((room)=>{
//     room.roomID === room.id
// })

// const handleSubmit = (formData) => {
//     // console.log(formData)
//     const temp = {
//         id: 1,
//         name: formData.roomName,
//         type: formData.type,
//         curMemberNum: 15,
//         memberLimit: 50
//     }
//     state.roomsList.push(temp)
// }

const enterRoom = (room) => {
    curUserState.room = room
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

.roomList::-webkit-scrollbar {
    width: 3px;
    display: block;
}

.roomList::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
}

:is(.dark .roomList)::-webkit-scrollbar-track {
    background: #a2a2a2;
    border-radius: 10px;
}

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

.userItem {
    border-radius: 0.5rem;
    transition: background-color ease-in-out 0.15s;
}

.userItem:hover {
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

:is(.dark .userItem:hover) {
    background-color: rgb(28 28 32 / var(--tw-bg-opacity));
}
</style>