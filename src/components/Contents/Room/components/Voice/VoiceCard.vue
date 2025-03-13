<template>
    <div class="flex-shrink-0 select-none box-content VoiceRoomMembers" :key="curUserState.room.id">
        <div class="relative flex flex-wrap text-sm flex-shrink-0" ref="scrollRef">
            <!-- 这个是当前用户 -->
            <UserCard v-if="curUserState.userInfo.name" :user="curUserState.userInfo" />
            <template v-for="user in channelState.InRoomMember" :key="user.id">
                <UserCard v-if="isUserCardVisible && curUserState.userInfo.id !== user.id" :user="user" :userAudioNodeMap="audioWebRTC.userAudioNodeMap"/>
                <!--                TODO socket id 和userid 不是一个 下边这个是本地流-->

            </template>
        </div>
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
let audioWebRTC
const startWebRTC = async () => {
    audioWebRTC = new AudioWebRTC()
    await audioWebRTC.initMediaStream()
    await audioWebRTC.startCall()

    setTimeout(()=>{
        console.log(audioWebRTC.userAudioNodeMap)
    },2000)

}
// 控制 UserCard 是否显示
const isUserCardVisible = ref(false);
onMounted(async () => {
    await nextTick()

    await startWebRTC()
    isUserCardVisible.value = true;  // 在 DOM 更新后显示 UserCard 组件
    // await startWebSocket()


    // document.getElementById('local-audio').srcObject = localStream.value;
});

onUnmounted(()=>{
    window.socket = null
    audioWebRTC.WebSocketSender.closeAllConnections()
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