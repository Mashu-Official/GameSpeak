import { Socket } from "socket.io-client";
import { useCurUserState } from "../../../../../pinia/curUserState.ts";

export class MessageWebSocket {
    private socket: Socket;
    private readonly roomID: string = "";
    private localStream: MediaStream | null = null;
    private peerConnections: Map<string, RTCPeerConnection> = new Map();
    private remoteStreams: Map<string, MediaStream> = new Map();
    private iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
    public callback: Function = ()=>{}

    constructor() {
        if (window.socket) {
            this.socket = window.socket;
            this.roomID = useCurUserState().room.id;
            this.setupWebRTCSignalListeners(); // 抽取的信令监听函数
        } else {
            throw new Error("WebSocket 未初始化！");
        }
    }

    /**
     *  统一注册 WebRTC 信令事件
     */
    private setupWebRTCSignalListeners() {
        this.socket.on("user-joined", (userId) => this.createPeerConnection(userId));
        this.socket.on("offer", async (data) => {
            // console.log(data)
            await this.handleOffer(data)
        });
        this.socket.on("answer", (data) => this.handleAnswer(data));
        this.socket.on("candidate", (data) => this.handleCandidate(data));
        this.socket.on("user-left", (userId) => this.handleUserLeft(userId));
    }


    /**
     *  初始化 PeerConnection
     */
    // @ts-ignore
    createPeerConnection(userId: string) {
        // 检查是否已经为当前用户创建了连接，如果已创建则不再重复创建
        if (this.peerConnections.has(userId)) return;

        // 创建一个新的 RTCPeerConnection 实例，配置包含 ICE 服务器（用于 NAT 穿越）
        const peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });

        // 设置 onicecandidate 事件监听器，当新的 ICE 候选被收集到时触发
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // 发送 ICE 候选到服务器，以便其他用户使用
                this.socket.emit("candidate", { candidate: event.candidate, room: this.roomID, sender: this.socket.id });
            }
        };

        // 设置 onconnectionstatechange 事件监听器，当 WebRTC 连接状态发生变化时触发
        peerConnection.onconnectionstatechange = () => {
            console.log(`📡 用户 ${userId} WebRTC 连接状态:`, peerConnection.connectionState);
            // 如果连接状态为 failed，则尝试重新连接
            if (peerConnection.connectionState === "failed") {
                console.warn(`❌ 用户 ${userId} WebRTC 连接失败，尝试重新连接`);
                this.reconnectPeer(userId);
            }
        };

        // 设置 ontrack 事件监听器，当接收到远程流（音频/视频）时触发
        peerConnection.ontrack = (event) => {
            // 如果还没有为该用户创建远程流，则创建一个新的 MediaStream
            if (!this.remoteStreams.has(userId)) {
                this.remoteStreams.set(userId, new MediaStream());
            }

            // 获取存储该用户远程流的 MediaStream 对象
            const remoteStream = this.remoteStreams.get(userId)!;
            // 将接收到的音频/视频轨道添加到该远程流中
            remoteStream.addTrack(event.track);




            // 如果有回调函数，则将远程流传递给回调

               if (this.callback) {
                   this.callback(userId, remoteStream);
               }
               else {
                   throw new Error("callback 传参错误")
               }

        };

        // 将创建的 peerConnection 保存到 peerConnections 中，以便后续管理
        this.peerConnections.set(userId, peerConnection);
        console.log(`✅ 已为用户 ${userId} 创建 WebRTC 连接`);
    }


    /**
     *  发送 offer（发起通话）
     */
    async startCall(localStream: MediaStream) {
        // if (!this.roomID) throw new Error("请先加入房间！");

        this.localStream = localStream;

        for (const [userId, peerConnection] of this.peerConnections) {
            this.localStream.getTracks().forEach(track => peerConnection.addTrack(track, this.localStream!));


            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);


            this.socket.emit("offer", { sdp: offer, room: this.roomID, sender: this.socket.id });
            console.log(`发送 Offer 给 ${userId}`);
        }
    }

    /**
     *  处理收到的 Offer
     */
    async handleOffer(data: { sdp: RTCSessionDescriptionInit; sender: string }) {
        // console.log("收到 Offer", data);

        if (!this.peerConnections.has(data.sender)) {
            this.createPeerConnection(data.sender);
        }
        const peerConnection = this.peerConnections.get(data.sender)!;

        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        this.socket.emit("answer", { sdp: answer, room: this.roomID, sender: this.socket.id });
        console.log(`发送 Answer 给 ${data.sender}`);
    }

    /**
     *  处理收到的 Answer
     */
    async handleAnswer(data: { sdp: RTCSessionDescriptionInit; sender: string }) {
        // console.log("收到 Answer", data);

        if (!this.peerConnections.has(data.sender)) return;
        const peerConnection = this.peerConnections.get(data.sender)!;

        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
    }

    /**
     *  处理收到的 ICE 候选
     */
    async handleCandidate(data: { candidate: RTCIceCandidateInit; sender: string }) {
        // console.log("📡 收到 ICE 候选", data);

        if (!this.peerConnections.has(data.sender)) return;
        const peerConnection = this.peerConnections.get(data.sender)!;

        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));

        peerConnection.onicegatheringstatechange = () => {
            // console.log(`🧊 ICE 状态 ${data.sender}:`, peerConnection.iceGatheringState);
            if (peerConnection.iceGatheringState === "complete") {
                console.log(`✅ ICE 交换完成，用户 ${data.sender} 可以进行通话`);
            }
        };
    }

    /**
     *  处理用户离开
     */
    handleUserLeft(userId: string) {
        console.log(`用户 ${userId} 离开`);

        if (this.peerConnections.has(userId)) {
            this.peerConnections.get(userId)!.close();
            this.peerConnections.delete(userId);
            this.remoteStreams.delete(userId);
        }
    }

    /**
     *  重新连接某个用户
     */
    reconnectPeer(userId: string) {
        console.warn(`🔄 重新连接用户 ${userId}`);

        if (this.peerConnections.has(userId)) {
            this.peerConnections.get(userId)!.close();
            this.peerConnections.delete(userId);
            this.remoteStreams.delete(userId);
        }

        setTimeout(() => {
            this.createPeerConnection(userId);
        }, 1000);
    }

    /**
     *  关闭所有 WebRTC 连接
     */
    closeAllConnections() {
        this.peerConnections.forEach((peerConnection) => peerConnection.close());
        this.peerConnections.clear();
        this.remoteStreams.clear();
        this.localStream = null;
        console.log("所有连接已关闭");
    }
}
