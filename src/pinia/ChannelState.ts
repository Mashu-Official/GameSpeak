import { defineStore } from "pinia";
import {Room} from "../interface&enum/Room.ts";
import {UserInVoiceRoom} from "../interface&enum/userInVoiceRoom.ts";
import axiosReq from "../assets/js/axiosBase/axiosObject.js";
import {b} from "vite/dist/node/types.d-aGj9QkWt";


// @ts-ignore
export const useChannelState = defineStore('useChannelState', {
    state: () => ({
        roomList: [] as Room[],
        memberChangeFlag: false as boolean,
        roomsMember: [] as UserInVoiceRoom[],
    }),
    actions: {
        async getRoomList (url:string){
            try {
                const res = await axiosReq.get(url)
                this.roomList = res.data
            }
            catch (e) {
                console.log(e)
            }
        },
    },

});
