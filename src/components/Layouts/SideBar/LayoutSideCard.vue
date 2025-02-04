<template>
<div class="sidebar flex flex-col items-center h-full relative py-2 overflow-hidden">

    <div class="avatar" @mouseenter="showRoomName($event, '私信')" @mouseleave="hideRoomName">
        <div class="avatarContainer">
            <img class="object-cover w-full h-full" src="" alt="">
        </div>
    </div>
    <div class="avatar" @mouseenter="showRoomName($event, '私信')" @mouseleave="hideRoomName">
        <div class="avatarContainer">
            <img class="object-cover w-full h-full" src="" alt="">
        </div>
    </div>
    <div class="avatar" @mouseenter="showRoomName($event, '私信')" @mouseleave="hideRoomName">
        <div class="avatarContainer">
            <img class="object-cover w-full h-full" src="" alt="">
        </div>
    </div>

    <div class="divide"></div>

    <div class="roomList flex flex-col overflow-y-scroll h-[372px]">
        <div class="avatar" v-for="room in state.rooms" :key="room.id" @mouseenter="showRoomName($event, room.name)" @mouseleave="hideRoomName">
            <div class="avatarContainer" v-if="room.avatarURL" @click="enterRoom(room.hashID)">
                <img class="object-cover w-full h-full " :src="room.avatarURL" :alt="room.avatarURL">
            </div>
            <div v-else class="avatarContainer flex flex-col justify-center items-center">
                <div class="text-2xl font-bold">
                    {{ room.name.slice(0,1) }}
                </div>
            </div>
        </div>
    </div>

    <div class="overflow-hidden w-[52px] h-[52px] absolute bottom-4 circle" style="    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));">
        <img class="object-cover w-full h-full" src="" alt="">
    </div>
</div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";

interface RoomAttribute{
    id: number, // optional
    name: string,
    hashID: string,
    avatarURL: string,
}

const state = reactive<{ rooms: RoomAttribute[] }>({
    rooms: [],
})
state.rooms = [
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
const InitState:() => void = ()=>{

}

const enterRoom:(roomHashID)=> void =()=>{

}
let roomNameElement = ref<HTMLElement | null>(null);
function showRoomName(event: MouseEvent, roomName: string) {
    if (!roomNameElement.value) {
        roomNameElement.value = document.createElement('div');
        roomNameElement.value.classList.add('roomName');
        document.body.appendChild(roomNameElement.value);
    }
    roomNameElement.value.textContent = roomName;
    const avatarElement = event.currentTarget as HTMLElement;
    const avatarRect = avatarElement.getBoundingClientRect();

    // 设置.roomName的高度
    roomNameElement.value.style.height = `${avatarRect.height / 2 }px`;
    // 计算.roomName的位置，使其位于.avatar的右侧并垂直居中
    roomNameElement.value.style.left = `${avatarRect.right + window.scrollX + 8}px`;
    roomNameElement.value.style.top = `${avatarRect.top + window.scrollY + (avatarRect.height - parseInt(roomNameElement.value.style.height)) / 2}px`;

    roomNameElement.value.style.opacity = '1';
}
function hideRoomName() {
    if (roomNameElement.value) {
        roomNameElement.value.style.opacity = '0';
        if (roomNameElement.value) {
            roomNameElement.value.remove();
            roomNameElement.value = null;
        }
    }
}

</script>

<style scoped>
.roomList{
    overflow: auto;
    scrollbar-width: none;   /* Firefox */
    -ms-overflow-style: none;  /* IE & Edge */
}
.roomList::webkit-scrollbar {
    display: none; /* WebKit 浏览器 */
}

.avatar{
    cursor: pointer;
    box-sizing: border-box;
    --tw-bg-opacity: 1;
    transition: scale ease-in 0.18s;
    padding: 6px 12px;
    width: 100%;
}

.avatar > .avatarContainer{
    width: 50px;
    height: 50px;
    border-radius: 16px;
    overflow: hidden;
    transition: scale ease-in 0.18s;
}

.avatar > .avatarContainer:hover {
    scale: 110%;
}
.selectedAvatar{
    border: solid blue 2px;
    /*   selected 直接内联 */
}
.circle{
    border-radius: 520px;
}
.divide{
    margin: 6px 0;
    border: solid blue 1px;
    width: 60%;
}
</style>