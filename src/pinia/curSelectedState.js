import {defineStore} from "pinia";
import {useToast} from "vue-toastification";

const toast = useToast()

export const useCurSelectedState = defineStore('useCurSelectedState', {
    state: () => ({
        server: {},
        room: {},
    }),
    actions: {

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
