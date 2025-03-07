import {useCurUserState} from "../../../../../pinia/curUserState.ts";

export class AudioWebSocket {
    private context: AudioContext;

    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    }


    // ✅ 修正音频发送
    sendAudioBuffer(pcmData: Float32Array): void {
        const pcmArrayBuffer = pcmData.buffer;

        window.socket.emit("startAudioStream", {
            userID: useCurUserState().userInfo.id,
            audioBuffer: pcmArrayBuffer,
        });
    }

    // ✅ 修正音频接收
    receiveAudioBuffer(handleAudioBuffer: Function): void {
        window.socket.on("receiveAudioStream", async (audioPackage: audioPackage) => {
            const userID = audioPackage.userID;
            const pcmData = audioPackage.audioBuffer;
            handleAudioBuffer(userID, pcmData);
        });
    }
}
export interface audioPackage {
    userID: string;
    audioBuffer: ArrayBuffer;
}