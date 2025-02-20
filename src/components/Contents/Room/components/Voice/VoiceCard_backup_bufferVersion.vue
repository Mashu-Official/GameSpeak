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
import { useCurUserState } from "../../../../../pinia/curUserState.ts";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { UserInVoiceRoom } from "../../../../../interface&enum/userInVoiceRoom.ts";
import UserCard from "./UserCard.vue";
import { useChannelState } from "../../../../../pinia/ChannelState.ts";
import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";

const curUserState = useCurUserState();
const channelState = useChannelState();
const devicesStore = useDevicesStore();

let mediaRecorder: MediaRecorder | null = null;
let audioContext: AudioContext | null = null;

onMounted(async () => {
    await nextTick();
    console.log(window.socket);
    window.socket.emit('startVoiceChat', 'testword');
    await startAudioStream();
    receiveAudioStream(); // 注意：这里不需要等待 receiveAudioStream 完成，因为它设置了一个监听器
});

const startAudioStream = async () => {
    try {
        devicesStore.logDevices();
        const constraints = {
            audio: devicesStore.audioInput?.deviceId ? { deviceId: { exact: devicesStore.audioInput.deviceId } } : true,
        };

        devicesStore.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('成功获取到音频流:', devicesStore.mediaStream);

        if (devicesStore.mediaStream) {
            mediaRecorder = new MediaRecorder(devicesStore.mediaStream, {
                mimeType: 'audio/webm; codecs=opus',
                audioBitsPerSecond: 128000, // 初始比特率，可根据网络状况动态调整
            });

            mediaRecorder.addEventListener("dataavailable", (event) => {
                if (event.data && event.data.size > 0) {
                    window.socket.emit("startAudioStream", event.data, (ack) => {
                        if (!ack) {
                            console.warn("音频块未确认，尝试重传...");
                            window.socket.emit("startAudioStream", event.data); // 简单重传逻辑
                        }
                    });
                }
            });

            mediaRecorder.start(100); // 每 100ms 触发一次 dataavailable 事件

            // 初始化 AudioContext
            audioContext = new AudioContext();
        }
    } catch (err) {
        console.error("访问麦克风失败:", err);
    }
};

// 接收音频流并播放
const receiveAudioStream = () => {
    window.socket.on('receiveAudioStream', async (audioChunk: Blob | ArrayBuffer) => {
        let arrayBuffer: ArrayBuffer;
        if (audioChunk instanceof Blob) {
            arrayBuffer = await audioChunk.arrayBuffer();
        } else {
            arrayBuffer = audioChunk;
        }

        // 直接播放每一个接收到的音频数据块
        await playAudio(arrayBuffer);
    });
};

// 播放音频
const playAudio = async (audioData: ArrayBuffer) => {
    let audioBlob: Blob;
    audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/webm; codecs=opus' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.addEventListener('error', (e) => console.error('播放失败:', e));
    await audio.play().catch((error) => console.error('播放音频失败:', error));
};

// 组件卸载时清理资源
onUnmounted(() => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder = null;
    }
    if (devicesStore.mediaStream) {
        devicesStore.mediaStream.getTracks().forEach(track => track.stop());
        devicesStore.mediaStream = null;
    }
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
});
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