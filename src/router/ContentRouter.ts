import {RouteRecordRaw} from "vue-router";
// @ts-ignore
import LayoutContent from "../components/Layouts/LayoutContent.vue";

export const ContentRoute: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: LayoutContent,
        children: [
            // ContentRouter  // Content功能路由

        ]
    },
];