// src/composables/useAudioWebRTC.ts

import { ref } from 'vue';
import { useCurUserState } from "../../../../../pinia/curUserState.ts";
import { useChannelState } from "../../../../../pinia/ChannelState.ts";
import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";

export const useAudioWebRTC = () => {
    const curUserState = useCurUserState();
    const channelState = useChannelState();
    const devicesStore = useDevicesStore();

    const peerConnections = ref<{ [key: string]: RTCPeerConnection }>({}); // 存储每个用户的peer connection
    const localStream = ref<MediaStream | null>(null); // 本地音频流

    // 音频参数与约束
    const constraints:MediaStreamConstraints= {
        audio: {
            // @ts-ignore
            deviceId: devicesStore.audioInput?.deviceId ? { exact: devicesStore.audioInput.deviceId } : true,
            sampleRate: 48000,  // 设置设备采样率为 48000Hz（可根据需要调整）
            autoGainControl: true, // 启用自动增益控制
            echoCancellation: true, // 启用回声消除
            noiseSuppression: true, // 启用噪声抑制
        },
    };

    // WebRTC 配置
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:23.21.150.121' },
            { urls: 'stun:stun01.sipphone.com' },
            { urls: 'stun:stun.ekiga.net' },
            { urls: 'stun:stun.fwdnet.net' },
            { urls: 'stun:stun.ideasip.com' },
            { urls: 'stun:stun.iptel.org' },
            { urls: 'stun:stun.rixtelecom.se' },
            { urls: 'stun:stun.schlund.de' },
            { urls: 'stun:stunserver.org' },
            { urls: 'stun:stun.softjoys.com' },
            { urls: 'stun:stun.voiparound.com' },
            { urls: 'stun:stun.voipbuster.com' },
            { urls: 'stun:stun.voipstunt.com' },
            { urls: 'stun:stun.voxgratia.org' },
            { urls: 'stun:stun.xten.com' },
        ],
        iceCandidatePoolSize: 10, // 提高候选池大小
    };

    // 初始化本地媒体流
    const initMediaStream = async () => {
        try {
            devicesStore.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            localStream.value = devicesStore.mediaStream
            await startAudioStream();
            await receiveAudioStream();
        } catch (error) {
            console.error('Error accessing microphone', error);
        }
    };

    // 创建WebRTC offer
    const createOffer = (userId: string) => {
        const pc = new RTCPeerConnection(configuration);

        // 添加本地流到连接
        if (devicesStore.mediaStream) {
            devicesStore.mediaStream.getTracks().forEach(track => pc.addTrack(track, devicesStore.mediaStream));
        }

        // 调整音频轨道的比特率
        pc.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'audio') {
                const params = sender.getParameters();
                params.encodings[0].maxBitrate = 96 * 1000; // 设置更高的比特率（单位：bps）
                sender.setParameters(params);
            }
        });

        // 创建 offer
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => window.socket.emit('offer', { offer: pc.localDescription, to: userId }));

        peerConnections.value[userId] = pc;
    };

    // 开始接收音频流
    const startAudioStream = () => {
        window.socket.on('offer', async (data) => {
            const pc = new RTCPeerConnection(configuration);
            if (devicesStore.mediaStream) {
                devicesStore.mediaStream.getTracks().forEach(track => pc.addTrack(track, devicesStore.mediaStream));

            }

            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            window.socket.emit("answer", { answer: pc.localDescription, to: data.from });

            pc.ontrack = (event) => {
                const remoteAudio = document.getElementById(`remote-audio-${data.from}`) as HTMLAudioElement;
                if (remoteAudio.srcObject !== event.streams[0]) {
                    remoteAudio.srcObject = event.streams[0];
                }
            };

            peerConnections.value[data.from] = pc;
        });

        window.socket.on('answer', (data) => {
            const pc = peerConnections.value[data.from];
            pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        window.socket.on('candidate', (data) => {
            const pc = peerConnections.value[data.from];
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        // 向所有其他房间成员发出 offer
        for (const user of channelState.roomMember) {
            if (user.id !== curUserState.userInfo.id) {
                createOffer(user.id);
            }
        }
    };

    // 接收音频流
    const receiveAudioStream = () => {
        window.socket.on('receiveAudioStream', (connected) => {
            console.log(connected);
        });

        for (const pc of Object.values(peerConnections.value)) {
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const toUserId = '这里替换为获取对方ID的逻辑';
                    window.socket.emit('candidate', { candidate: event.candidate, to: toUserId });
                }
            };
        }
    };

    // 监听ICE状态变化（网络连接质量）
    const onIceConnectionStateChange = () => {
        for (const pc of Object.values(peerConnections.value)) {
            pc.oniceconnectionstatechange = () => {
                const state = pc.iceConnectionState;
                if (state === 'failed' || state === 'disconnected') {
                    console.error(`ICE connection failed: ${state}`);
                }
            };
        }
    };

    return {
        peerConnections,
        localStream,
        startAudioStream,
        receiveAudioStream,
        initMediaStream,
        onIceConnectionStateChange,
    };
};
