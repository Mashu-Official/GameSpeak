import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import router from "../router";

import {channelAttribute} from "../interface&enum/ChannelAttribute.ts";
import {Room} from "../interface&enum/Room.ts";
import {hideChannelName} from "../assets/js/channelName.ts";
interface UserInfo {
    name: string | null;
    avatar: string | null;
}

// @ts-ignore
export const useCurUserState = defineStore('useCurUserState', {
    state: () => ({
        channel: {} as Record<string, any>, // 根据实际情况调整类型
        room: {} as Record<string, any>,   // 进入的 这个用于视图上
        curConnectedRoom: {} as Record<string, any>, // 进入并且链接上服务器的 用于功能逻辑
        userInfo: {
            name: null as string | null,
            avatar: null as string | null,
        } as UserInfo,
        token: null as string | null,
        isElectronEnv: !!window.ipcRenderer, // 判断是否在Electron环境中
    }),
    actions: {
        initSelect(){
            this.channel = {}
            this.room = {}
        },
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
        enterChannel(channel:channelAttribute) {
            this.room = {}
            router.push(`/channel/${channel.hashID}`).then(() => {
                this.channel = channel;
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
