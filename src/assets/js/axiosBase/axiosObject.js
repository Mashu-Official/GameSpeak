import axios from "axios";
import { useCurUserState } from "@/pinia/curUserState.ts";
import router from "../../../router/index.ts";

const axiosReq = axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL,
    baseURL: "http://127.0.0.1:42224",
    timeout: 3500,
    headers: {'X-Custom-Header': 'foobar'},
    withCredentials : true
})

// 请求拦截器：在请求发送前自动添加 Authorization 头部
axiosReq.interceptors.request.use((config) => {
    // console.log("localstorage:", localStorage.getItem('token'))
    // console.log("pinia:", useCurUserState().token)
    const token =  useCurUserState().token || localStorage.getItem('token'); // 从本地存储获取 token
    // console.log(token)
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // 添加到请求头部
    }
    return config;
}, (error) => {
    // 请求错误处理
    return Promise.reject(error);
});

// 响应拦截器：处理未授权错误
axiosReq.interceptors.response.use((response) => {
    // 对响应数据做点什么
    return response;
}, (error) => {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
        // 如果是未授权错误，可以执行登出操作或重定向到登录页面
        console.error('用户未授权，请重新登录');
        // 清除本地存储中的 token
        localStorage.removeItem('token');
        // 可以在此处重定向到登录页面
        router.push('/login')
    }
    return Promise.reject(error);
});
export default axiosReq