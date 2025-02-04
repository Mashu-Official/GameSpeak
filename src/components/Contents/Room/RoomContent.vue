<template>
    <div class="flex flex-1 flex-row w-full pl-8 pt-8">
<!--房间列表-->
        <RoomsList/>
        <!--默认窗口-->
        <HeroCard/>
        <!--聊天窗口-->
        <MessagesCard />
        <!--语音窗口-->
        <VoiceCard />
    </div>


</template>

<script setup lang="ts">
import {reactive} from "vue";
import MessagesCard from "../FuncCard/MessagesCard.vue";
import RoomsList from "./RoomsList.vue";
import VoiceCard from "../FuncCard/VoiceCard.vue";
import HeroCard from "../FuncCard/HeroCard.vue";

interface Messages {
    id: number
    time: string
    content: string | string[]  // 后端设计成这样
    userName: string
    userAvatar: string
}

const state = reactive<{ messages: Messages[] }>({
    messages: [
        {
            id: 1,
            time: "2025-02-04 12:34",
            content: "今天天气真不错，适合出去走走。",
            userName: "张三",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        },
        {
            id: 2,
            time: "2025-02-04 13:15",
            content: "最近工作有点忙，好久没见了，大家还好吗？",
            userName: "李四",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        }
    ]
})
</script>

<style scoped>
.messageTime{
    font-size: 12px;
}
</style>