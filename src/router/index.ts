import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// @ts-ignore
import Main from "../components/Layout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Main,
        children: [
            // BodyRouter  // 主功能路由

        ]
    }
];

const router = createRouter({
    history: createWebHistory(), // 历史模式
    routes // 导入路由
});

export default router;