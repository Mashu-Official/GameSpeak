import { defineStore } from "pinia";
import router from "../router";
import {channelAttribute} from "../interface&enum/ChannelAttribute.ts";
import {Room} from "../interface&enum/Room.ts";
import {useChannelState} from "./ChannelState.ts";


interface UserInfo {
    id: string | null
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
            id: null as string | null,
            name: null as string | null,
            avatar: null as string | null,
        } as UserInfo,
        token: null as string | null,
        isElectronEnv: !!window.ipcRenderer, // 判断是否在Electron环境中
        leaveRoomFlag: false as boolean,
        // SocketChannel: null as object | null, // 当前socket实例
        // SocketRoom: null as object | null, // 当前socket实例
    }),
    actions: {
        initSelect(){
            // this.channel = {}
            // this.room = {}
        },
        enterChannel(channel:channelAttribute) {
            this.room = {}
            router.push(`/channel/${channel.hashID}`).then(() => {
                this.channel = channel;
            });
        },
        enterRoom(room:Room) {
            this.room = room;
            // this.curConnectedRoom = room;
        },
        leaveRoom(){
            this.leaveRoomFlag = !this.leaveRoomFlag
            useChannelState().memberChangeFlag = !useChannelState().memberChangeFlag
        }
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
