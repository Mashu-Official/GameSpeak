import {defineStore} from "pinia";
import {useToast} from "vue-toastification";

const toast = useToast()

export const useServerState = defineStore('useServerState', {
    state: () => ({
        themeTitle: '',
        themeMode: localStorage.getItem('dark-mode') || 'dark',
        html: document.querySelector('html'),
        colorSchemes: {
            dark: {title: '黑夜模式：开启' },
            light: {title: '黑夜模式：关闭' },
        }
    }),
    actions: {

    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage, // 默认存储 localStorage
            }
        ]
    }
});
