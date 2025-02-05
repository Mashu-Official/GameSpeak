import {defineStore} from "pinia";
import {useToast} from "vue-toastification";
import router from "../router";

const toast = useToast()

export const useCurSelectedState = defineStore('useCurSelectedState', {
    state: () => ({
        server: {},
        room: {},
    }),
    actions: {
       enterServer(server){
        this.server = server
        router.push(`/server/${server.hashID}`)
       },
        enterRoom(room){
            this.room = room
        }
    },

    persist: {
        // enabled: true,
        // strategies: [
        //     {
        //         storage: localStorage, // 默认存储 localStorage
        //         paths: ['theme']
        //     }
        // ]
    }
});
