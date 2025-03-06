<template>
    <div class="flex-shrink-0 select-none box-content VoiceRoomMembers">
        <div class="relative flex flex-wrap text-sm flex-shrink-0" ref="scrollRef">
            <!-- 这个是当前用户 -->
            <UserCard v-if="curUserState.userInfo.name" :user="curUserState.userInfo" />
            <audio :src="devicesStore.mediaStream" />
            <template v-for="user in channelState.roomMember" :key="user.id">
                <UserCard :user="user" v-if="curUserState.userInfo.id !== user.id" />
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
import {nextTick, onMounted, ref} from "vue";
import UserCard from "../UserCard.vue";
import {useChannelState} from "../../../../../../pinia/ChannelState.ts";
import {useDevicesStore} from "../../../../../../pinia/deviceStore.ts";

const curUserState = useCurUserState();
const channelState = useChannelState();
const devicesStore = useDevicesStore();

let peerConnections = {}; // 存储每个用户的peer connection
const configuration = {
    iceServers: [
        // { urls: 'stun:stun.l.google.com:19302' }, // Google's public STUN server
        // { urls: 'stun.voip.aebc.com'},
        // { urls: 'stun.internetcalls.com'}
    ],
    iceCandidatePoolSize: 10, // 提高候选池大小
};

const localStream = ref<MediaStream | null>(null); // 本地音频流
const constraints = {
    audio: {
        deviceId: devicesStore.audioInput?.deviceId ? { exact: devicesStore.audioInput.deviceId } : true,
        // echoCancellation: true, // 启用回声消除
        // noiseSuppression: true, // 启用噪声抑制
        autoGainControl: true, // 启用自动增益控制
    }
};


onMounted(async () => {
    await nextTick();
    console.log(window.socket);
    // devicesStore.logDevices()
    // console.log(devicesStore.audioOutput?.label)
    window.socket.emit("startAudioStream", 'connected');
    await initMediaStream()

    document.getElementById('local-audio').srcObject = localStream.value;

});

async function initMediaStream() {
    try {
        localStream.value = await navigator.mediaDevices.getUserMedia(constraints);
        // startAudioStream();
        // receiveAudioStream();
    } catch (error) {
        console.error('Error accessing microphone', error);
    }
}

function createOffer(userId) {
    const pc = new RTCPeerConnection(configuration);

    // 添加本地流到连接
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => pc.addTrack(track, localStream.value));
    }

    // 调整音频轨道的比特率
    pc.getSenders().forEach(sender => {
        if (sender.track && sender.track.kind === 'audio') {
            const params = sender.getParameters();
            params.encodings[0].maxBitrate = 384000; // 设置最大比特率（单位：bps）
            sender.setParameters(params);
        }
    });

    pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => window.socket.emit('offer', { offer: pc.localDescription, to: userId }));

    peerConnections[userId] = pc;
}


function startAudioStream() {
    // 假设configuration已定义
    const configuration = null; // 根据实际情况设置

    window.socket.on("offer", async (data) => {
        const pc = new RTCPeerConnection(configuration);
        if (localStream.value) {
            localStream.value.getTracks().forEach(track => pc.addTrack(track, localStream.value));
        }

        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        window.socket.emit("answer", { answer: pc.localDescription, to: data.from });

        pc.ontrack = (event) => {
            const remoteAudio = document.getElementById(`remote-audio-${data.from}`);
            if (remoteAudio.srcObject !== event.streams[0]) {
                remoteAudio.srcObject = event.streams[0];
            }
        };

        // 存储peer connection
        peerConnections[data.from] = pc;
    });

    window.socket.on('answer', (data) => {
        const pc = peerConnections[data.from];
        pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    window.socket.on('candidate', (data) => {
        const pc = peerConnections[data.from];
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    for (const user of channelState.roomMember) {
        if (user.id !== curUserState.userInfo.id) {
            createOffer(user.id);
        }
    }
}

function receiveAudioStream() {
    window.socket.on('receiveAudioStream', (connected) => {
        console.log(connected)
    })
    for (const pc of Object.values(peerConnections)) {
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const toUserId = '这里替换为获取对方ID的逻辑';
                window.socket.emit('candidate', { candidate: event.candidate, to: toUserId });
            }
        };
    }
}
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