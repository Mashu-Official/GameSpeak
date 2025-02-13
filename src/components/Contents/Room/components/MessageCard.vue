<template>
    <div class="flex flex-col justify-between flex-1 w-full">
        <div class="messagesList" ref="messageContainer">
            <div class="flex flex-col space-y-3.5 h-0 flex-1">
                <div class="flex flex-col items-start " v-for="(message, index) in state.messages"
                     :key="message.timeStamp">
                    <!-- message item ↓ -->
                    <div class="flex flex-row space-x-2">
                        <!-- 头像区域 -->
                        <div class="min-w-10 max-w-10 min-h-10 max-h-10 overflow-hidden circle">
                            <img class="w-full h-full circle object-cover" :src="message.userAvatar"
                                 :alt="message.userAvatar">
                        </div>
                        <!-- 用户名 + 时间 -->
                        <div class="flex flex-col">
                            <div class="flex items-center space-x-2 whitespace-nowrap">
                                <div class="text-base">{{ message.userName }}</div>
                                <div class="messageTime text-sm" style="color: rgb(127,127,133)">
                                    {{ message.time }}
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

                    <div class="mb-28" v-if="index === state.messages.length - 1"></div>
                </div>
            </div>
        </div>

        <div class="flex mt-2 w-full pr-4">
            <div class="f-inp flex flex-row items-center w-full">
                <input v-model="message" :placeholder="`向 ${ curUserState.room.name } 发送消息`"
                       @keyup.enter="sendMessage">
                <button class="whitespace-nowrap" @click="sendMessage">发送</button>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import {useCurUserState} from "../../../../pinia/curUserState.ts";
import {Messages} from "../../../../interface&enum/Messages.ts";
import {nextTick, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import io from 'socket.io-client';


const curUserState = useCurUserState();
const state = reactive<{ messages: Messages[] }>({
    messages: []
});
const message = ref<string>('');
const roomName = ref<string>('123'); // 房间名称

// Socket 实例
const socket = io('http://127.0.0.1:42224/message', {
    path: '/message/'
});

// 加入房间
const initMessages = () => {
    const roomWebSocketID = `${curUserState.channel.hashID}-${curUserState.room.id}`
    console.log(roomWebSocketID)
    socket.emit("joinRoom", {
        roomID: curUserState.room.id,   // 数据库上的ID
        roomWebSocketID: roomWebSocketID,  // WS房间ID
    })

    socket.emit("getMessage")
}
// })
initMessages()

const messageContainer = ref(null)

const scrollToBottom = async () => {
    const container = messageContainer.value;
    if (container) {
        // 确保 DOM 更新完成后再执行滚动
        await nextTick(() => {
            container.scrollTop = container.scrollHeight;
        });
    }
};

onMounted(async () => {
    await nextTick()
    await scrollToBottom()
})

watch(() => state.messages, () => {
    scrollToBottom();
}, {
    immediate: true,
    deep: true,
});  // immediate: true 确保组件初次加载时也能滚动到底部


socket.on("joinedRoom", (r) => {
    console.log(r)
})
socket.on("getMessage", (messageList) => {
    console.log(messageList)
    state.messages.push(...messageList)
})


socket.on("message", (message) => {
    console.log(message)
    state.messages.push(message)
})

watch(() => curUserState.room.name, () => {
    if (socket) {
        socket.close(); // 关闭socket连接
        console.log('关闭')
    }
}, {
    deep: true
})
// 发送消息
const sendMessage = () => {
    if (!message.value.trim()) return; // 确保消息不为空
    const msgFrame = {
        userID: 1,
        content: message.value
    };
    socket.emit('message', msgFrame); // 发送消息给服务器
    message.value = ''; // 清空输入框
};

onBeforeUnmount(() => {
    if (socket) {
        socket.close(); // 关闭socket连接
    }
});

//  一坨屎
</script>

<style scoped>
.messagesList {
    flex: 1;
    flex-shrink: 0;
    overflow-y: scroll;
}

.messageContent {
    font-size: 16px;
    line-height: 20px;
    word-break: break-all; /* 强制打断单词换行 */
    white-space: pre-wrap; /* 保留空白符序列，但是正常地进行换行 */
    overflow-wrap: break-word; /* 在长单词或 URL 地址内部进行换行 */
}

.messageTime {
    font-size: 12px;
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

/* 设置滚动条的宽度 */
.messagesList::-webkit-scrollbar {
    width: 4px;
    display: block;
}

/* 设置滚动条的背景 */
.messagesList::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
}

:is(.dark .messagesList)::-webkit-scrollbar-track {
    background: #a2a2a2;
    border-radius: 10px;
}

/* 设置滚动条的滑块 */
.messagesList::-webkit-scrollbar-thumb {
    background: #a2a2a2;
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

:is(.dark .messagesList)::-webkit-scrollbar-thumb {
    background: #ffffff; /* 滚动条滑块的颜色 */
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

.messagesList::-webkit-scrollbar-thumb:hover {
    background: #464646
}

.messagesList::-webkit-scrollbar-corner {
    background: #f1f1f1;
}
</style>