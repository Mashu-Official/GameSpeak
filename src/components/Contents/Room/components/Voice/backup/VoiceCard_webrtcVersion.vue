<template>
    <div class="flex-shrink-0 select-none box-content VoiceRoomMembers" :key="curUserState.room">
        <div class="relative flex flex-wrap text-sm flex-shrink-0" ref="scrollRef">
            <!-- 这个是当前用户 -->
            <UserCard v-if="curUserState.userInfo.name" :user="curUserState.userInfo" />
            <audio :src="devicesStore.mediaStream" />
            <template v-for="user in channelState.roomMember" :key="user.id">
                <UserCard :user="user" v-if="curUserState.userInfo.id !== user.id" />
                <!--                TODO socket id 和userid 不是一个-->
                <audio :id="`remote-audio-${user.id}`" autoplay style="display:none;"></audio>
            </template>
        </div>
        <audio id="local-audio" autoplay></audio>

        <!-- 这里添加显示连接的部分 -->
        <div>
            <h3>已建立连接的用户:</h3>
            <ul>
                <li v-for="(pc, userId) in peerConnections" :key="userId">
                    用户 ID: {{ userId }} 已连接
                </li>
            </ul>
        </div>
    </div>
</template>


<script setup lang="ts">
import {useCurUserState} from "../../../../../../pinia/curUserState.ts";
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import UserCard from "../UserCard.vue";
import {useChannelState} from "../../../../../../pinia/ChannelState.ts";
import {useDevicesStore} from "../../../../../../pinia/deviceStore.ts";
import {useAudioWebRTC} from "../VoiceCardWebsocket.ts";

const curUserState = useCurUserState();
const channelState = useChannelState();
const devicesStore = useDevicesStore();

const {
    peerConnections,
    localStream,
    startAudioStream,
    receiveAudioStream,
    initMediaStream,
    closeMediaStream
} = useAudioWebRTC();

onMounted(async () => {
    await nextTick();
    await initMediaStream()
    document.getElementById('local-audio').srcObject = localStream.value;
});

onUnmounted(()=>{
    closeMediaStream()
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