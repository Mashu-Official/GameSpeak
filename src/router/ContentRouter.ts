import {RouteRecordRaw} from "vue-router";
// @ts-ignore
import LayoutContent from "../components/Layouts/LayoutContent.vue";
import Room from "../components/Contents/Room/ServerPage.vue";
import webrtc from "../components/demo/webrtc.vue";

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
                path: '',
                name: 'demo',
                component: webrtc,
            },
            // {
            //     path: '/message',
            //     name: 'room',
            //     component:Room
            // },
        ]
    },
];