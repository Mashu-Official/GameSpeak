import {RouteRecordRaw} from "vue-router";
// @ts-ignore
import LayoutContent from "@/components/Layouts/LayoutContent.vue";
import Room from "@/components/Contents/ChannelPage.vue";
import webrtc from "@/components/demo/webrtc.vue";
import LoginPage from "@/components/Login/LoginPage.vue";
import LoginCard from "../components/Login/Components/LoginCard.vue";
import SignUpCard from "../components/Login/Components/SignUpCard.vue";
import demo2 from "../components/demo/demo2.vue";

export const ContentRoute: Array<RouteRecordRaw> = [
    {
        path: '',
        component: LayoutContent,
        children: [
            {
                path: '/channel/:hashID',
                name: 'room',
                component: Room
            },
            {
                path: '/demo',
                name: 'demo',
                // component: webrtc,
                component: demo2,
            },
            {
                path: '/login',
                name: 'login',
                component: LoginPage,
                children:[
                    {
                        path: '',
                        name: 'loginCard',
                        component: LoginCard,
                    }
                ]
            },
            {
                path: '/signup',
                name: 'signup',
                component: LoginPage,
                children:[
                    {
                        path: '',
                        name: 'SignUpCard',
                        component: SignUpCard,
                    }
                ]
            },
        ]
    },
];