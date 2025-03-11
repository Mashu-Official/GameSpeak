<template>
    <div>
        <h2>WebRTC Direct Signaling Audio Demo</h2>
        <audio ref="localAudio" autoplay controls></audio>
        <audio ref="remoteAudio" autoplay controls></audio>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        // 定义变量
        const localAudio = ref(null);
        const remoteAudio = ref(null);

        const localStream = ref(null);
        const localPeerConnection = ref(null);
        const remotePeerConnection = ref(null);

        const SAMPLERATE = 384000;
        const SAMPLESIZE = 24;
        const CHANNELCOUNT = 2;
        const InputQuality = {
            // echoCancellation: true, // 启用回声消除
            // noiseSuppression: true, // 启用噪声抑制
            // highpassFilter: true,  // 高通滤波器
        };

        const constraints = {
            audio: {
                deviceId: true,
                channelCount: CHANNELCOUNT,
                sampleRate: SAMPLERATE,
                sampleSize: SAMPLESIZE,
                volume: 1.0, // 你可以根据需要调整音量
                ...InputQuality
            }
        };

        // 启动 WebRTC
        const startWebRTC = async () => {
            try {
                // 获取用户音频
                localStream.value = await navigator.mediaDevices.getUserMedia(constraints);
                localAudio.value.srcObject = localStream.value;

                // 配置 STUN 服务器
                const configuration = {
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                };

                // 创建本地 PeerConnection
                localPeerConnection.value = new RTCPeerConnection(configuration);

                // 将本地音频流添加到 PeerConnection
                localStream.value.getTracks().forEach(track =>
                    localPeerConnection.value.addTrack(track, localStream.value)
                );

                // 当有 ICE 候选项时，发送给远程端
                localPeerConnection.value.onicecandidate = ({ candidate }) => {
                    if (candidate) {
                        remotePeerConnection.value.addIceCandidate(candidate);
                    }
                };

                // 接收到远程音频流时，显示在远程音频标签上
                localPeerConnection.value.ontrack = ({ streams: [stream] }) => {
                    remoteAudio.value.srcObject = stream;
                };

                // 创建远程 PeerConnection
                remotePeerConnection.value = new RTCPeerConnection(configuration);

                // 当有 ICE 候选项时，发送给本地端
                remotePeerConnection.value.onicecandidate = ({ candidate }) => {
                    if (candidate) {
                        localPeerConnection.value.addIceCandidate(candidate);
                    }
                };

                // 接收到本地音频流时，显示在本地音频标签上
                remotePeerConnection.value.ontrack = ({ streams: [stream] }) => {
                    localAudio.value.srcObject = stream;
                };

                // 创建并发送 offer
                const offer = await localPeerConnection.value.createOffer();
                await localPeerConnection.value.setLocalDescription(offer);

                // 接收并设置远端的 offer
                await remotePeerConnection.value.setRemoteDescription(offer);

                // 创建并发送 answer
                const answer = await remotePeerConnection.value.createAnswer();
                await remotePeerConnection.value.setLocalDescription(answer);

                // 设置本地端的 answer
                await localPeerConnection.value.setRemoteDescription(answer);
            } catch (error) {
                console.error('Error starting WebRTC:', error);
            }
        };

        // 在组件挂载时启动 WebRTC
        onMounted(() => {
            startWebRTC();
        });

        // 返回变量和方法
        return {
            localAudio,
            remoteAudio,
        };
    }
};
</script>

<style scoped>
audio {
    width: 45%;
    margin: 10px;
    border: 1px solid #ccc;
}
</style>
