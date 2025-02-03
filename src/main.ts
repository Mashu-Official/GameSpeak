import {createApp} from 'vue'
import './style.css'
// @ts-ignore
import App from './App.vue'
import routes from './router/index.ts'

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';


const app = createApp(App)
app.use(routes)
app.use(ArcoVue);


app.mount('#app').$nextTick(() => {
// Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
    })
})
