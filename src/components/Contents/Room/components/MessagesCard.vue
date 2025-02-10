<template>
    <div class="flex flex-1 flex-col items-start h-full px-8  relative">
        <div class="text-xl">{{ curUserState.room.name || "找不到该房间" }}</div>

        <div class="divide mb-4" style="width: 100%"></div>

        <div class="flex flex-col justify-between flex-1" ref="parentContainerRef">
            <div class="flex flex-col space-y-3">
                <div class="flex flex-col items-start"  v-for="message in state.messages" :key="message.timeStamp">
                    <!-- message item ↓ -->
                    <div class="flex flex-row space-x-2">
                        <!-- 头像区域 -->
                        <div class="min-w-10 max-w-10 min-h-10 max-h-10 overflow-hidden circle">
                            <!--                        <img :src="message.userAvatar" :alt="message.userAvatar">-->
                            <img class="w-full h-full circle" :src="message.userAvatar" :alt="message.userAvatar">
                        </div>
                        <!-- 用户名 + 时间 -->
                        <div class="flex flex-col">

                            <div class="flex items-end space-x-2 whitespace-nowrap">
                                <div>{{ message.userName }}</div>
                                <div class="messageTime" style="color: rgb(127,127,133)">
                                    {{ message.time }} {{ message.timeStamp }}
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
            </div>

            <div class="">
                <form class="" action="" method="post" autocomplete="off" novalidate>
                    <div class="f-inp flex flex-row items-center">
                        <input :placeholder="`向 ${curUserState.room.name} 发送消息`">
                        <button type="button" class="whitespace-nowrap">发送</button>
                    </div>
                </form>
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import {useCurUserState} from "../../../../pinia/curUserState.ts";
import {Messages} from "../../../../interface&enum/Messages.ts";
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {setWidth} from "../../../../assets/js/dynamticOverflow.js";

const curUserState = useCurUserState()


onMounted(async () => {
    // await nextTick();
    // await setWidth(textInputRef, parentContainerRef)
    // window.addEventListener('resize', () => {
    //     setWidth(textInputRef, parentContainerRef)
    // });
});

onUnmounted(()=>{
    window.removeEventListener('resize', () => {
        setWidth(textInputRef, parentContainerRef);
    });
})

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

.f-inp {
    padding: 12px 22px;
    border: 2px solid #6e6d6d;
    box-sizing: border-box;
    line-height: 20px;
    border-radius: 16px;
    margin-bottom: 13.5px;
}

.f-inp input {
    width: 100%;
    font-size: 16px;

    color: rgb(35, 45, 65);
    outline: none;
    background-color: transparent;
}

:is(.dark .f-inp input) {
    color: rgb(255, 255, 255);
}



</style>