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
import { useCurUserState } from "../../../../../../pinia/curUserState.ts";
import { nextTick, onMounted, onUnmounted } from "vue";
import { useChannelState } from "../../../../../../pinia/ChannelState.ts";
import { useDevicesStore } from "../../../../../../pinia/deviceStore.ts";
import UserCard from "../UserCard.vue";

const curUserState = useCurUserState();
const channelState = useChannelState();
const devicesStore = useDevicesStore();

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let play = false; // 控制播放状态
let audioCtx: AudioContext | null = null;

onMounted(async () => {
    await nextTick();
    await startAudioStream();
    receiveAudioStream();
});

let source: MediaStreamAudioSourceNode | null = null;
let workletNode: AudioWorkletNode | null = null;

const startAudioStream = async () => {
    try {
        const constraints = {
            audio: devicesStore.audioInput?.deviceId ? { deviceId: { exact: devicesStore.audioInput.deviceId } } : true,
        };

        if (!audioCtx) {
            audioCtx = new AudioContext();
        }

        devicesStore.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('成功获取到音频流:', devicesStore.mediaStream);

        await audioCtx.audioWorklet.addModule('/src/assets/js/audio-processor.js');
        workletNode = new AudioWorkletNode(audioCtx, 'audio-processor');

        if (devicesStore.mediaStream && workletNode) {
            source = audioCtx.createMediaStreamSource(devicesStore.mediaStream);
            source.connect(workletNode);
            workletNode.connect(audioCtx.destination);

            workletNode.port.onmessage = async (event) => {
                const inputData = event.data;
                let jsonData = JSON.stringify(inputData);
                if (window.socket && window.socket.connected) {
                    window.socket.emit('startAudioStream', jsonData);
                } else {
                    console.error("Socket is not connected");
                }
            };
        }
    } catch (err) {
        console.error("访问麦克风失败:", err);
    }
};
const receiveAudioStream = async () => {

    window.socket.on('receiveAudioStream', async (audioData: Blob | ArrayBuffer) => {
        console.log('接收到的音频数据:', audioData);

        if (!audioCtx) {
            console.error("AudioContext is not initialized");
            return;
        }

        try {
            let arrayBuffer: ArrayBuffer;
            if (audioData instanceof Blob) {
                arrayBuffer = await audioData.arrayBuffer();
            } else {
                arrayBuffer = audioData;
            }

            // 检查arrayBuffer是否为空
            if (arrayBuffer.byteLength === 0) {
                console.warn("Received empty audio data");
                return;
            }

            const float32Array = new Float32Array(arrayBuffer);

            // 动态创建AudioBuffer，根据实际接收到的数据大小
            const myArrayBuffer = audioCtx.createBuffer(1, float32Array.length, 16000); // 假设采样率为16kHz
            const nowBuffering = myArrayBuffer.getChannelData(0);

            // 将接收到的数据赋值给AudioBuffer
            for (let i = 0; i < float32Array.length; i++) {
                nowBuffering[i] = float32Array[i];
            }

            const source = audioCtx.createBufferSource();
            source.buffer = myArrayBuffer;
            const gainNode = audioCtx.createGain();
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            const muteValue = play ? 1 : 0;
            gainNode.gain.setValueAtTime(muteValue, audioCtx.currentTime);
            source.start();
        } catch (error) {
            console.error('音频播放失败:', error);
        }
    });
};

onUnmounted(() => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder = null;
    }
    if (devicesStore.mediaStream) {
        devicesStore.mediaStream.getTracks().forEach(track => track.stop());
        devicesStore.mediaStream = null;
    }
    if (source) {
        source.disconnect();
    }
    if (workletNode) {
        workletNode.disconnect();
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