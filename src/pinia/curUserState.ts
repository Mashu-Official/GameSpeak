import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import router from "../router";

import {serverAttribute} from "../interface&enum/ServerAttribute.ts";
import {Room} from "../interface&enum/Room.ts";
interface UserInfo {
    name: string | null;
    avatar: string | null;
}

// @ts-ignore
export const useCurUserState = defineStore('useCurUserState', {
    state: () => ({
        server: {} as Record<string, any>, // 根据实际情况调整类型
        room: {} as Record<string, any>,   // 进入的 这个用于视图上
        curConnectedRoom: {} as Record<string, any>, // 进入并且链接上服务器的 用于功能逻辑
        userInfo: {
            name: null as string | null,
            avatar: null as string | null,
            // 示例数据：
            // name: '123',
            // avatar: 'https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png',
        } as UserInfo,
        isElectronEnv: !!window.ipcRenderer, // 判断是否在Electron环境中
    }),
    actions: {
        initSetting() {
            // 在这里可以添加逻辑来检查是否有默认设置需要被应用
            // 例如，可以从后端获取默认设置或者设定一些初始值
            // 示例：检查是否已经设置了麦克风和耳机，如果没有，则设置为默认值
            // if (!this.setting.microphone) {
            //     this.setting.microphone = 'default-microphone'; // 示例默认值
            // }
            // if (!this.setting.headphone) {
            //     this.setting.headphone = 'default-headphone'; // 示例默认值
            // }
            // if (!this.setting.microphoneSpeakType) {
            //     this.setting.microphoneSpeakType = 'voice-activated'; // 示例默认值
            // }
        },
        enterServer(server:serverAttribute) {
            this.room = {}
            router.push(`/server/${server.hashID}`).then(() => {
                this.server = server;
            });
        },
        enterRoom(room:Room) {
            this.room = room;
            this.curConnectedRoom = room;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage, // 对全体持久化
            }
        ]
    }
});
