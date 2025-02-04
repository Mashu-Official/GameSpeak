import {RouteRecordRaw} from "vue-router";
// @ts-ignore
import LayoutContent from "../components/Layouts/LayoutContent.vue";
import Room from "../components/Contents/Room/Room.vue";

export const ContentRoute: Array<RouteRecordRaw> = [
    {
        path: '',
        component: LayoutContent,
        children: [
            {
                path: '/room/:hashID',
                name: 'room',
                component:Room
            },
            {
                path: '',
                name: 'room',
                component:Room
            },
            // {
            //     path: '/message',
            //     name: 'room',
            //     component:Room
            // },
        ]
    },
];