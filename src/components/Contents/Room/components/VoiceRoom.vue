<template>

    <div class="flex flex-col h-full w-full px-8 relative overflow-hidden">
        <div class="text-xl">{{ curUserState.room.name || "找不到该房间" }}</div>
        <div class="divide mb-4" style="width: 100%"></div>

        <VoiceCard class="h-1/3"/>
        <div class="divide my-4"></div>
        <MessageCard class="flex-1 h-full" :key="curUserState.room.id"/>
    </div>
</template>

<script setup lang="ts">
import {useCurUserState} from "../../../../pinia/curUserState.ts";
import {Messages} from "../../../../interface&enum/Messages.ts";
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {setWidth} from "../../../../assets/js/dynamticOverflow.js";
import {useHorizontalScroll} from "../../../../assets/js/HorizontalScroll.ts";
import {UserInVoiceRoom} from "../../../../interface&enum/userInVoiceRoom.ts";
import UserCard from "./UserCard.vue";
import VoiceCard from "./VoiceCard.vue";
import MessageCard from "./MessageCard.vue";

const curUserState = useCurUserState()

const state = reactive<{ users: UserInVoiceRoom[] }>({
    users: []
})
state.users = [
    {
        uid: 1,
        volume: 75, // 假设音量是一个介于0到100之间的数字
        username: "Alice",
        avatar: "https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png",
    }, {
        uid: 2,
        volume: false, // 或者设置为false表示静音
        username: "Alice",
        avatar: "https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png",
    },
    {
        uid: 1,
        volume: 75, // 假设音量是一个介于0到100之间的数字
        username: "Alice",
        avatar: "https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png",
    }, {
        uid: 2,
        volume: false, // 或者设置为false表示静音
        username: "Alice",
        avatar: "https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png",
    },
    {
        uid: 1,
        volume: 75, // 假设音量是一个介于0到100之间的数字
        username: "Alice",
        avatar: "https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png",
    }, {
        uid: 2,
        volume: false, // 或者设置为false表示静音
        username: "Alice",
        avatar: "https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img113945398_p0.png",
    }
]


</script>

<style scoped>

</style>