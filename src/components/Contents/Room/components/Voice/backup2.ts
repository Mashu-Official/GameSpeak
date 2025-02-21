import { ref } from 'vue';
import { useCurUserState } from "../../../../../pinia/curUserState.ts";
import { useChannelState } from "../../../../../pinia/ChannelState.ts";
import { useDevicesStore } from "../../../../../pinia/deviceStore.ts";

// 音频 WebRTC 相关功能
export const useAudioWebRTC = () => {
    const curUserState = useCurUserState();
    const channelState = useChannelState();
    const devicesStore = useDevicesStore();

    const peerConnections = ref<{ [key: string]: RTCPeerConnection }>({}); // 存储每个用户的 peer connection
    const localStream = ref<MediaStream | null>(null); // 本地音频流

    // 音频设备约束
    const constraints: MediaStreamConstraints = {
        audio: {
            deviceId: devicesStore.audioInput?.deviceId ? { exact: devicesStore.audioInput.deviceId } : true,
            channelCount: 2,
            volume: devicesStore.inputVolume * 0.01,
            sampleRate: 384000,  // 采样率
            sampleSize: 24,
            autoGainControl: true, // 启用自动增益控制
            // echoCancellation: true, // 启用回声消除
            // noiseSuppression: true, // 启用噪声抑制
            // highpassFilter: true,  // 高通滤波器
        },
    };

    // WebRTC 配置，包括多个 STUN 服务器
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            // 可以根据需要添加更多 STUN/TURN 服务器
        ],
        iceCandidatePoolSize: 10, // 提高候选池大小
        rtcpMuxPolicy: 'require',  // 强制使用 RTP 多路复用，减少 RTP 流的延迟
    };

    const config = {
        constraints,
        fftSize: 512
    }
    const audioByteRate: number = devicesStore.audioByteRate   // 音频流的上传码率


    const audioInput = ref()
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // 创建音频上下文
    const analyser = audioContext.createAnalyser(); // 创建音频分析器
    analyser.fftSize = config.fftSize;  // 频率变换大小

    const recorder = audioContext.createScriptProcessor(config.fftSize, config.constraints.audio.channelCount, config.constraints.audio.channelCount);
    // recorder.onaudioprocess = onaudioprocess.bind(this);

    // 用于缓存音频数据
    const audioBufferQueue = []; // 存储音频数据的缓冲区
    const previousBuffer = null; // 上一个音频缓冲区，用于交叉淡入淡出

    const varBridge = {}

    // 初始化本地媒体流
    const initMediaStream = async () => {
        try {
            devicesStore.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            audioInput.value = audioContext.createMediaStreamSource(devicesStore.mediaStream)   // 媒体流做完声音源
            analyser.connect(recorder);
            recorder.connect(audioContext.destination);
            // localStream.value = devicesStore.mediaStream; // 保留本地流的引用
            // 将流传递到audioPlayer
            const audioPlayer = document.getElementById('audioPlayer');

            // @ts-ignore
            audioPlayer.srcObject = devicesStore.mediaStream; // 实时播放

        } catch (error) {
            console.error('获取麦克风音频失败', error);
        }
    };


    onaudioprocess(e) {
        const data = e.inputBuffer.getChannelData(0); // 采集单通道音频数据

        // 将音频数据加入缓冲区
        this.audioBufferQueue.push(new Float32Array(data));

        // 如果缓冲区数据大于一定大小，则处理并播放音频
        if (this.audioBufferQueue.length * this.config.fftSize >= this.config.fftSize) {
            this.handlePcm();
        }
    }



    // 创建 WebRTC offer 并发送音频流
    const createOffer = (userId: string) => {
        const pc = new RTCPeerConnection(configuration);

        // 添加本地音频流到 WebRTC 连接
        if (devicesStore.mediaStream) {
            devicesStore.mediaStream.getTracks().forEach(track => pc.addTrack(track, devicesStore.mediaStream));
        }

        // 调整音频轨道的比特率（例如设置最大比特率）
        pc.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'audio') {
                const params = sender.getParameters();
                params.encodings[0].maxBitrate = audioByteRate; // 设置音频比特率
                sender.setParameters(params);
            }
        });

        // 创建 offer
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => window.socket.emit('offer', { offer: pc.localDescription, to: userId }));

        peerConnections.value[userId] = pc;
    };

    // 向其他房间成员发送音频流（发起音频流）
    const startAudioStream = () => {
        for (const user of channelState.roomMember) {
            if (user.id !== curUserState.userInfo.id) {
                createOffer(user.id);
            }
        }
    };

    // 接收音频流
    const receiveAudioStream = () => {
        // 监听从其他用户发来的 offer
        window.socket.on('offer', async (data) => {
            const pc = new RTCPeerConnection(configuration);

            // 添加本地音频流到 WebRTC 连接
            if (devicesStore.mediaStream) {
                devicesStore.mediaStream.getTracks().forEach(track => pc.addTrack(track, devicesStore.mediaStream));
            }

            // 设置远程描述并创建 answer
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            window.socket.emit("answer", { answer: pc.localDescription, to: data.from });

            // 处理音频流
            pc.ontrack = (event) => {
                const remoteAudio = document.getElementById(`remote-audio-${data.from}`) as HTMLAudioElement;
                if (remoteAudio.srcObject !== event.streams[0]) {
                    remoteAudio.srcObject = event.streams[0];
                }
            };

            peerConnections.value[data.from] = pc;
        });

        // 监听来自其他用户的 answer
        window.socket.on('answer', (data) => {
            const pc = peerConnections.value[data.from];
            pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        // 监听 ICE 候选信息
        window.socket.on('candidate', (data) => {
            const pc = peerConnections.value[data.from];
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        });
    };

    // 监听 ICE 连接状态变化（网络连接质量监控）
    const onIceConnectionStateChange = () => {
        for (const pc of Object.values(peerConnections.value)) {
            pc.oniceconnectionstatechange = () => {
                const state = pc.iceConnectionState;
                if (state === 'failed' || state === 'disconnected') {
                    console.error(`ICE 连接失败：${state}`);
                }
            };
        }
    };

    // 关闭本地流并停止 WebRTC 连接
    const closeMediaStream = () => {
        if (localStream.value) {
            // 停止本地流的所有轨道
            localStream.value.getTracks().forEach(track => track.stop());
            devicesStore.mediaStream = null; // 清空媒体流引用
            localStream.value = null; // 清空本地流
        }

        // 关闭所有的 peer connection
        Object.values(peerConnections.value).forEach(pc => {
            pc.close(); // 关闭 WebRTC 连接
        });

        peerConnections.value = {}; // 清空 peerConnections 引用
    };

    return {
        peerConnections,
        localStream,
        startAudioStream,  // 启动音频流发送
        receiveAudioStream,  // 启动音频流接收
        initMediaStream, // 初始化本地音频流
        onIceConnectionStateChange, // 监听 ICE 状态变化
        closeMediaStream, // 关闭流和 WebRTC 连接
    };
};
