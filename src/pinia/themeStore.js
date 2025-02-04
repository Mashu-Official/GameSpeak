import {defineStore} from "pinia";
import {useToast} from "vue-toastification";

const toast = useToast()

export const useThemeStore = defineStore('useThemeStore', {
    state: () => ({
        themeTitle: '',
        themeMode: localStorage.getItem('dark-mode') || 'dark',
        html: document.querySelector('html'),
        body: document.querySelector('body'),
        colorSchemes: {
            dark: {title: '黑夜模式：开启' },
            light: {title: '黑夜模式：关闭' },
        }
    }),
    actions: {
        switchColorSchemeTo(themeMode = 'dark') {
            const isDark = this.themeMode === 'dark';
            // 添加过渡效果
            this.html.classList.toggle('transition-effect', true);
            // 根据模式切换 CSS 类
            isDark ? this.html.classList.add('dark') : this.html.classList.remove('dark');
            isDark ? document.body.setAttribute('arco-theme', 'dark') :  document.body.removeAttribute('arco-theme');
            // 移除过渡效果
            setTimeout(() => this.html.classList.toggle('transition-effect', false), 250);
        },
        // 根据 LocalStorage 自动切换
        switchColorSchemeByLocalStorage() {
            this.themeMode = localStorage.getItem('theme')
            this.themeTitle = this.themeMode === 'dark' ? '关闭黑夜模式' : '打开黑夜模式'
            // 更新所有按钮的状态
            document.querySelectorAll('[data-id="theme-btn"]').forEach((btn) => {
                btn.dataset.mode = this.themeMode;
            });
            // 应用颜色模式
            this.switchColorSchemeTo(this.themeMode);
        },
        // 手动切换
        clickToSwitchTheme() {
            const currentMode = this.themeMode
            // console.log(`currentMode: ${currentMode}`)
            const nextMode = currentMode === 'dark' ? 'light' : 'dark';
            // console.log(nextMode)
            const message = this.themeMode === 'dark' ?  '关闭黑夜模式' :'打开黑夜模式'
            localStorage.setItem('theme',nextMode)
            toast.info(message)
            this.themeMode = nextMode

            // 更新页面颜色模式
            this.switchColorSchemeByLocalStorage();
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage, // 默认存储 localStorage
                paths: ['theme']
            }
        ]
    }
});

export const initThemeBtn = () => {
        // 为所有切换按钮绑定事件
        const buttons = document.querySelectorAll('[data-id="theme-btn"]');
        buttons.forEach((btn) => btn.addEventListener('click', useThemeStore().clickToSwitchTheme));
        // 根据 LocalStorage 初始化颜色模式
        useThemeStore().switchColorSchemeByLocalStorage();
}