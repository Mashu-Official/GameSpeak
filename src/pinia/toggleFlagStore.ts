import {defineStore} from "pinia";

export const useToggleFlagStore = defineStore(' useToggleFlagStore', {
    state: () => ({
       subMenuLock: false as Boolean
    }),
    actions: {

    },
});
