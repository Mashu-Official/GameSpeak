<template>
    <div class="flex-shrink-0 select-none box-content VoiceRoomMembers" :key="curUserState.room">
        <div class="relative flex flex-wrap text-sm flex-shrink-0" ref="scrollRef">
            <!-- 这个是当前用户 -->
            <UserCard v-if="curUserState.userInfo.name" :user="curUserState.userInfo" />
            <audio :src="devicesStore.mediaStream" />
            <template v-for="user in channelState.roomMember" :key="user.id">
                <UserCard :user="user" v-if="curUserState.userInfo.id !== user.id" />
<!--                TODO socket id 和userid 不是一个 下边这个是本地流-->
                <audio id='audioPlayer' autoplay style="display:none;"></audio>
            </template>
        </div>
            <audio id="local-audio" autoplay></audio>

        <!-- 这里添加显示连接的部分 -->
<!--        <div>-->
<!--            <h3>已建立连接的用户:</h3>-->
<!--            <ul>-->
<!--                <li v-for="(pc, userId) in peerConnections" :key="userId">-->
<!--                    用户 ID: {{ userId }} 已连接-->
<!--                </li>-->
<!--            </ul>-->
<!--        </div>-->
    </div>
</template>


<script setup lang="ts">
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import UserCard from "./UserCard.vue";
import {useChannelState} from "../../../../../pinia/ChannelState.ts";
import {useDevicesStore} from "../../../../../pinia/deviceStore.ts";
import {audioConnectType, PcmRecorder} from "./VoiceCardWebsocket.ts";

import {AudioWebRTC} from "./VoiceCardWebrtc.ts";

const curUserState = useCurUserState();
const channelState = useChannelState();
const devicesStore = useDevicesStore();


// // const recorder = new PcmRecorder(audioConnectType['webrtc']);
// const audioWebRTC = new AudioWebRTC()
// const startWebRTC = async () => {
//     await audioWebRTC.initMediaStream()
//     // 2. 监听 WebRTC 音频流
//     await audioWebRTC.receiveAudioStream();
//     // 3. 开始向其他用户推流
//     await audioWebRTC.startAudioStream();
// }
const startWebSocket = async ()=>{
    const audioWebSocket = new PcmRecorder(audioConnectType['websocket']);
    await audioWebSocket.init_WebSocketMode();
    await audioWebSocket.onReceiveAudioBuffer()

}
onMounted(async () => {
    await nextTick()

    // await startWebRTC()
    await startWebSocket()


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