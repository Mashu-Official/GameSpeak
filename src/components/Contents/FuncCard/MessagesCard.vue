<template>
    <div class="flex flex-1 flex-col items-start h-full min-w-[287px] px-8">
        <div class="text-xl">{{ '房间名字' }}</div>

        <div class="divide mb-4" style="width: 100%"></div>

        <div class="flex flex-col space-y-3">
            <template v-for="message in state.messages" :key="message.timeStamp">
                <div class="flex flex-col items-start">
                    <!-- message item ↓ -->
                    <div class="flex flex-row space-x-2">
                        <!-- 头像区域 -->
                        <div class="min-w-10 max-w-10 min-h-10 max-h-10 overflow-hidden circle">
                            <!--                        <img :src="message.userAvatar" :alt="message.userAvatar">-->
                            <img class="w-full h-full circle" :src="message.userAvatar" :alt="message.userAvatar">
                        </div>
                        <!-- 用户名 + 时间 -->
                        <div class="flex flex-col">

                            <div class="flex items-end space-x-2">
                                <div>{{ message.userName }}</div>
                                <div class="messageTime" style="color: rgb(127,127,133)">
                                    {{ message.time }} {{ message.timeStamp}}
                                </div>
                            </div>

                            <div class="mt-2 " v-if="Array.isArray(message.content)">
                               <div class="messageContent overflow-clip" v-for="content in message.content">
                                   {{ content }}
                               </div>
                            </div>
                            <div class="mt-2 messageContent" v-else>
                                {{ message.content }}
                            </div>
                        </div>

                    </div>

                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">

import {reactive} from "vue";

interface Messages {
    id: number
    time: string
    timeStamp: number
    content: string | string[]  // 后端设计成这样
    userName: string
    userAvatar: string
}

const state = reactive<{ messages: Messages[] }>({
    messages: [
        {
            id: 1,
            time: "2025-02-04 12:34",
            timeStamp:  Date.now(),
            content: "今天天气真不错，适合出去走走。",
            userName: "张三",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        },
        {
            id: 2,
            time: "2025-02-04 13:15",
            timeStamp:  Date.now()+1,
            content: ["最近工作有点忙，好久没见了，大家还好吗？","最近工作有点忙，好久没见了，大家还好吗？","最近工作有点忙，好久没见了，大家还好吗？","最近工作有点忙，好久没见了，大家还好吗？",],
            userName: "李四",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        },
        {
            id: 2,
            time: "2025-02-04 13:15",
            timeStamp:  Date.now()+2,
            content: ["最近工作有点忙，好久没见了，大家还好吗？最近工作有点忙，好久没见了，大家还好吗？最近工作有点忙，好久没见了，大家还好吗？最近工作有点忙，好久没见了，大家还好吗？",],
            userName: "李四",
            userAvatar: "https://img.kookapp.cn/avatars/2022-04/Rw4r5wP0Oi02s02s.jpg?x-oss-process=style/icon"
        }
    ]
})
</script>

<style scoped>
.messageContent{
    font-size: 16px;
    line-height: 20px;
    word-break: break-all; /* 强制打断单词换行 */
    white-space: pre-wrap; /* 保留空白符序列，但是正常地进行换行 */
    overflow-wrap: break-word; /* 在长单词或 URL 地址内部进行换行 */
}
</style>