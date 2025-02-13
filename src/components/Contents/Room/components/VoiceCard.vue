<template>

    <div class="overflow-y-auto flex-shrink-0 select-none box-content VoiceRoomMembers">

        <div class="relative flex flex-wrap text-sm overflow-x-hidden flex-shrink-0"  ref="scrollRef">
            <!--        这个是当前用户        -->
            <UserCard v-if="curUserState.userInfo.name" :user="curUserState.userInfo" />

            <template v-for="user in state.users" :key="user.uid">
                <UserCard :user="user"/>
            </template>

        </div>
    </div>

</template>

<script setup lang="ts">
import {useCurUserState} from "../../../../pinia/curUserState.ts";
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {UserInVoiceRoom} from "../../../../interface&enum/userInVoiceRoom.ts";
import UserCard from "./UserCard.vue";

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

.VoiceRoomMembers {

}

.VoiceRoomMembers::-webkit-scrollbar {
    width: 4px;
    display: block;
}

/* 设置滚动条的背景 */
.VoiceRoomMembers::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
}

:is(.dark .VoiceRoomMembers)::-webkit-scrollbar-track {
    background: #a2a2a2;
    border-radius: 10px;
}

/* 设置滚动条的滑块 */
.VoiceRoomMembers::-webkit-scrollbar-thumb {
    background: #a2a2a2;
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

:is(.dark .VoiceRoomMembers)::-webkit-scrollbar-thumb {
    background: #ffffff; /* 滚动条滑块的颜色 */
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

.VoiceRoomMembers::-webkit-scrollbar-thumb:hover {
    background: #464646
}

.VoiceRoomMembers::-webkit-scrollbar-corner {
    background: #f1f1f1;
}
</style>