
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// @ts-ignore
import Main from "../components/Layout.vue";
import {ContentRoute} from "./ContentRouter.ts";
// import { useCurUserState } from "../pinia/curUserState.ts";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Main,
        children: [
            ...ContentRoute  // Content功能路由
        ],
    }
];

const router = createRouter({
    history: createWebHistory(), // 历史模式
    routes // 导入路由
});

export default router;