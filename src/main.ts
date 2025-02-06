import {createApp} from 'vue'
import './style.css'
// @ts-ignore
import App from './App.vue'
import routes from './router/index.ts'
import {createPinia} from "pinia";
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import Toast, {POSITION} from "vue-toastification";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import "vue-toastification/dist/index.css";
import "./assets/css/toastStyle.css"

const options = {
    position: POSITION.TOP_CENTER,
    transition: "Vue-Toastification__bounce",
    maxToasts: 2,
    timeout: 2500,
    newestOnTop: true,
    toastClassName: ["baseToastStyle","mainSchemeToast"], // 背景颜色
    bodyClassName: ["custom-class-1", "custom-class-2"]  // ??
};

const app = createApp(App)
const pinia = createPinia().use(piniaPluginPersistedstate)


// app.use(createPinia())
app.use(routes)
app.use(ArcoVue);
app.use(pinia)
app.use(Toast, options);  // 使用 vue-toastification

app.mount('#app').$nextTick(() => {
// Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
    })
})
