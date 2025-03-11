<template>
    <div class="flex-shrink-0 select-none box-content VoiceRoomMembers" :key="curUserState.room">
        <div class="relative flex flex-wrap text-sm flex-shrink-0" ref="scrollRef">
            <!-- 这个是当前用户 -->
            <UserCard v-if="curUserState.userInfo.name" :user="curUserState.userInfo" />
            <audio :src="devicesStore.mediaStream" />
            <template v-for="user in channelState.roomMember" :key="user.id">
                <UserCard :user="user" v-if="curUserState.userInfo.id !== user.id" />
                <!--                TODO socket id 和userid 不是一个 下边这个是本地流-->

            </template>
        </div>
        <audio id='audioPlayer' autoplay style="display:none;"></audio>
    </div>
</template>


<script setup lang="ts">
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import UserCard from "./UserCard.vue";
import {useChannelState} from "../../../../../pinia/ChannelState.ts";
import {useDevicesStore} from "../../../../../pinia/deviceStore.ts";
import {audioConnectType, PcmRecorder} from "./VoiceCardWebsocket.ts";

import {AudioWebRTC} from "./VoiceCardWebRTC.ts";

const curUserState = useCurUserState();
const channelState = useChannelState();
const devicesStore = useDevicesStore();


// const recorder = new PcmRecorder(audioConnectType['webrtc']);
setTimeout(()=>{
    console.log(useChannelState().InRoomMember)
},1000)
const startWebRTC = async () => {
    const audioWebRTC = new AudioWebRTC()

    await audioWebRTC.initMediaStream()
    await audioWebRTC.startCall()
}

onMounted(async () => {
    await nextTick()

    await startWebRTC()
    // await startWebSocket()


    // document.getElementById('local-audio').srcObject = localStream.value;
});

onUnmounted(()=>{
    // closeMediaStream()
    window.socket = null
    // curUserState.leaveRoom()
})

</script>

<style scoped>

.VoiceRoomMembers {

}

.VoiceRoomMembers::-webkit-scrollbar {
    width: 4px;
    display: block;
}

/* 设置滚动条的背景 */
.VoiceRoomMembers::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
}

:is(.dark .VoiceRoomMembers)::-webkit-scrollbar-track {
    background: #a2a2a2;
    border-radius: 10px;
}

/* 设置滚动条的滑块 */
.VoiceRoomMembers::-webkit-scrollbar-thumb {
    background: #a2a2a2;
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

:is(.dark .VoiceRoomMembers)::-webkit-scrollbar-thumb {
    background: #ffffff; /* 滚动条滑块的颜色 */
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

.VoiceRoomMembers::-webkit-scrollbar-thumb:hover {
    background: #464646
}

.VoiceRoomMembers::-webkit-scrollbar-corner {
    background: #f1f1f1;
}
</style>