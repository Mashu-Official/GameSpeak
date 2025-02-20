<template>

    <div class=" flex-shrink-0 select-none box-content VoiceRoomMembers">

        <div class="relative flex flex-wrap text-sm flex-shrink-0"  ref="scrollRef">
            <!--        这个是当前用户        -->
            <UserCard v-if="curUserState.userInfo.name" :user="curUserState.userInfo"/>

            <template v-for="user in channelState.roomMember" :key="user.id">
                <UserCard :user="user" v-if="curUserState.userInfo.id !== user.id"/>
            </template>

        </div>
    </div>

</template>

<script setup lang="ts">
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {UserInVoiceRoom} from "../../../../../interface&enum/userInVoiceRoom.ts";
import UserCard from "./UserCard.vue";
import {useChannelState} from "../../../../../pinia/ChannelState.ts";
import {useDevicesStore} from "../../../../../pinia/deviceStore.ts";

const curUserState = useCurUserState()
const channelState = useChannelState()
const devicesStore = useDevicesStore()

onMounted(async () =>{
    await nextTick()
    // await useDevicesStore().startMic()
    await nextTick()
    console.log(window.socket)
    window.socket.emit('startVoiceChat','testword')
    await startAudioStream()
    await receiveAudioStream()
})

const startAudioStream = async () => {
    try {
        devicesStore.logDevices();
        const constraints = {
            audio: devicesStore.audioInput?.deviceId ? {deviceId: {exact: devicesStore.audioInput.deviceId}} : true
        };

        devicesStore.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('成功获取到音频流:', devicesStore.mediaStream);

        if (devicesStore.mediaStream) {
            let mediaRecorder =new MediaRecorder(devicesStore.mediaStream, {
                mimeType: 'audio/webm; codecs=opus',
                audioBitsPerSecond: 242000, // 初始比特率，可根据网络状况动态调整
            });
            let audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", function () {
                let audioBlob = new Blob(audioChunks);
                audioChunks = [];

                // 原始数据
                window.socket.emit("startAudioStream", audioBlob);


                mediaRecorder.start();
                setTimeout(function () {
                    mediaRecorder.stop();
                }, 500);

            });
            mediaRecorder.start();
            setTimeout(function () {
                mediaRecorder.stop();
            }, 500);
        }
    } catch (err) {
        console.error("Error accessing microphone", err);
    }
}

// TODO 弱网优化
const receiveAudioStream = async ()=>{

    window.socket.on('receiveAudioStream', (audioData) => {
        console.log(audioData)
        const audioUrl = URL.createObjectURL(new Blob([audioData], { type: 'audio/webm; codecs=opus' }));
        const audio = new Audio(audioUrl);
        audio.play().catch(error => console.error('Error playing audio:', error));
    });

}

onUnmounted(()=>{
    window.socket.close()
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