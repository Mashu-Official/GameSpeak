import {RouteRecordRaw} from "vue-router";
// @ts-ignore
import LayoutContent from "@/components/Layouts/LayoutContent.vue";
import Room from "@/components/Contents/Room/ServerPage.vue";
import webrtc from "@/components/demo/webrtc.vue";
import LoginPage from "@/components/Login/LoginPage.vue";

export const ContentRoute: Array<RouteRecordRaw> = [
    {
        path: '',
        component: LayoutContent,
        children: [
            {
                path: '/server/:hashID',
                name: 'room',
                component:Room
            },
            {
                path: '/demo',
                name: 'demo',
                component: webrtc,
            },
            {
                path: '/login',
                name: 'login',
                component: LoginPage
            },
        ]
    },
];