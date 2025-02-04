import {createApp} from 'vue'
import './style.css'
// @ts-ignore
import App from './App.vue'
import routes from './router/index.ts'
import {createPinia} from "pinia";
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import Toast, {POSITION} from "vue-toastification";

import "vue-toastification/dist/index.css";
import "./assets/css/toastStyle.css"

const options = {
    position: POSITION.TOP_CENTER,
    transition: "Vue-Toastification__bounce",
    maxToasts: 3,
    timeout: 3100,
    newestOnTop: true,
    toastClassName: ["baseToastStyle","mainSchemeToast"], // 背景颜色
    bodyClassName: ["custom-class-1", "custom-class-2"]  // ??
};

const app = createApp(App)
app.use(routes)
app.use(ArcoVue);
app.use(createPinia())
app.use(Toast, options);  // 使用 vue-toastification

app.mount('#app').$nextTick(() => {
// Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
    })
})
