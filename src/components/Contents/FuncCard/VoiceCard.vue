<template>
    <div class="flex flex-1 flex-col items-start h-full min-w-[287px] px-8 relative">
        <div class="text-xl">{{ curUserState.room.name || "找不到该房间" }}</div>

        <div class="divide mb-4" style="width: 100%"></div>

        <div class="flex flex-row items-start flex-1">

            <div class="flex flex-col ViewCard p-0">
                <div class="h-[140px] w-[250px] rounded-lg">
                    <img class="rounded-lg h-full w-full"
                         :src="'https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon'"
                         alt="">
                </div>

                <div class="p-3">
                    <span class="text-base">{{ '用户名' }}</span>

                    <div class="flex flex-row items-center justify-between mt-2">

                        <button class="flex flex-row items-center whitespace-nowrap">
                            <svg v-show="1" width="20" height="20" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor"
                                      stroke-width="4"
                                      stroke-linejoin="round"/>
                                <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23"
                                      stroke="currentColor"
                                      stroke-width="4"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                            <svg v-show="" width="20" height="20" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor"
                                      stroke-width="4"
                                      stroke-linejoin="round"/>
                                <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23"
                                      stroke="currentColor"
                                      stroke-width="4"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
                            </svg>
                            <span class="ml-2 text-sm">{{ true ? '按键发言' : '自由发言'}}</span>
                        </button>

                        <button>
                            <svg v-show="1" width="20" height="20" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                                      stroke="currentColor"
                                      stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z"
                                      fill="none"
                                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                                <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                                      fill="currentColor"/>
                                <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z"
                                      fill="currentColor"/>
                                <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z"
                                      fill="none"
                                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                            </svg>
                            <svg v-show="" width="20" height="20" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                                      stroke="currentColor"
                                      stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z"
                                      fill="none"
                                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                                <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                                      fill="currentColor"/>
                                <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z"
                                      fill="currentColor"/>
                                <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z"
                                      fill="none"
                                      stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                                <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import {useCurUserState} from "../../../pinia/curUserState.js";
import {Messages} from "../../../interface/Messages.ts";
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {setWidth} from "../../../assets/js/dynamticOverflow.js";

const curUserState = useCurUserState()


onMounted(async () => {

});

onUnmounted(() => {

})

interface UserInVoiceRoom {
    id: number,
}

const state = reactive<{ messages: Messages[] }>({
    messages: [
        {
            id: 1,
            time: "2025-02-04 12:34",
            timeStamp: Date.now(),
            content: "今天天气真不错，适合出去走走。",
            userName: "张三",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        },
        {
            id: 2,
            time: "2025-02-04 13:15",
            timeStamp: Date.now() + 1,
            content: ["最近工作有点忙，好久没见了，大家还好吗？", "最近工作有点忙，好久没见了，大家还好吗？", "最近工作有点忙，好久没见了，大家还好吗？", "最近工作有点忙，好久没见了，大家还好吗？",],
            userName: "李四",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        },
        {
            id: 2,
            time: "2025-02-04 13:15",
            timeStamp: Date.now() + 2,
            content: ["最近工作有点忙，好久没见了，大家还好吗？最近工作有点忙，好久没见了，大家还好吗？最近工作有点忙，好久没见了，大家还好吗？最近工作有点忙，好久没见了，大家还好吗？",],
            userName: "李四",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        }
    ]
})


</script>

<style scoped>
</style>