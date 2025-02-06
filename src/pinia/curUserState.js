import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import router from "../router";

const toast = useToast();

export const useCurUserState = defineStore('useCurUserState', {
    state: () => ({
        server: {},
        room: {},
        setting: {
            microphone: null,
            headphone: null,
            microphoneSpeakType: null
        },
        userInfo:{
            name: null,
            avatar: null,
            // name: '123',
            // avatar: 'https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png',
        }
    }),
    actions: {
        initSetting() {
            // 在这里可以添加逻辑来检查是否有默认设置需要被应用
            // 例如，可以从后端获取默认设置或者设定一些初始值

            // 示例：检查是否已经设置了麦克风和耳机，如果没有，则设置为默认值
            if (!this.setting.microphone) {
                this.setting.microphone = 'default-microphone'; // 示例默认值
            }
            if (!this.setting.headphone) {
                this.setting.headphone = 'default-headphone'; // 示例默认值
            }
            if (!this.setting.microphoneSpeakType) {
                this.setting.microphoneSpeakType = 'voice-activated'; // 示例默认值
            }
        },
        enterServer(server) {
            router.push(`/server/${server.hashID}`).then(() => {
                this.server = server;
            });
        },
        enterRoom(room) {
            this.room = room;
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

// 确保在适当的地方调用 initSetting 方法，比如在应用启动的时候