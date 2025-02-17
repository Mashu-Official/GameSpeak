<template>
    <div v-for="room in channelState.roomList" :key="room.id" class="mb-[4px]">
        <div class="roomItem px-3 py-1.5 cursor-pointer mb-[4px]"
             :class="{ 'roomItem_Active' : curUserState.room.id === room.id}"
             @dblclick="curUserState.enterRoom(room)"
             :data-room-id="room.id">

            <div class="flex flex-row items-center">
                <!--文字-->
                <svg v-if="room.type === 'Text'" fill="none" height="22" viewBox="0 0 48 48" width="22"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M33 38H22V30H36V22H44V38H39L36 41L33 38Z" stroke="currentColor" stroke-linecap="round"
                          stroke-linejoin="round" stroke-width="3"/>
                    <path d="M4 6H36V30H17L13 34L9 30H4V6Z" fill="none" stroke="currentColor" stroke-linecap="round"
                          stroke-linejoin="round" stroke-width="3"/>
                    <path d="M19 18H20" stroke="currentColor" stroke-linecap="round" stroke-width="3"/>
                    <path d="M26 18H27" stroke="currentColor" stroke-linecap="round" stroke-width="3"/>
                    <path d="M12 18H13" stroke="currentColor" stroke-linecap="round" stroke-width="3"/>
                </svg>
                <!--语音-->
                <svg v-else-if="room.type === 'Voice'" fill="none" height="22" viewBox="0 0 48 48" width="22"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 6V42C17 42 11.7985 32.8391 11.7985 32.8391H6C4.89543 32.8391 4 31.9437 4 30.8391V17.0108C4 15.9062 4.89543 15.0108 6 15.0108H11.7985C11.7985 15.0108 17 6 24 6Z"
                          fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="3"/>
                    <path d="M32 15L32 15C32.6232 15.5565 33.1881 16.1797 33.6841 16.8588C35.1387 18.8504 36 21.3223 36 24C36 26.6545 35.1535 29.1067 33.7218 31.0893C33.2168 31.7885 32.6391 32.4293 32 33"
                          stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="3"/>
                </svg>

                <span class="whitespace-nowrap ml-2 py-2 font-semibold flex space-x-2 items-center">
                   <span>{{ room.name }}</span>
            <!--TODO 密码房间开发中-->

<!--                    <svg v-if="room.havePassword" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                        <rect x="6" y="22" width="36" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>-->
<!--                        <path d="M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                        <path d="M24 30V36" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>-->

                </span>
            </div>

            <span class="text-xs">{{ room.curMemberNum }}/{{ room.maximum }}</span>

        </div>
        <template v-for="item in channelState.roomsMember">
            <div v-for="user in item.users" v-if="room.id === item.roomID"
                 class="ml-6 userItem cursor-pointer select-none">
                <div class="px-4 py-1.5 flex justify-between items-center">
                    <div class="w-6 h-6">
                        <img :src="user.avatar"
                             alt=""
                             class="w-full h-full object-center object-cover circle">
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

<script lang="ts" setup>
import {onMounted, watch} from "vue";

import {useCurUserState} from "../../../../pinia/curUserState.ts";
import {useRoute} from "vue-router";
import {useChannelState} from "../../../../pinia/ChannelState.ts";

const route = useRoute()
const curUserState = useCurUserState()
const channelState = useChannelState()

onMounted(async () => {
    curUserState.room = {}
    await channelState.getRoomList(`/api/channel/${route.params.hashID}`)
});

watch(() => route.params.hashID, async (newHashID) => {
    if (newHashID) {
        await channelState.getRoomList(`/api/channel/${route.params.hashID}`)
    }
}, {immediate: true}); // 立即执行一次监听器

const enterRoom = (room) => {
    curUserState.room = room
}


</script>

<style scoped>
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