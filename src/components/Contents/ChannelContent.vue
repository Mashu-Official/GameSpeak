<template>
    <div class="flex flex-1 flex-row w-full" :key="curUserState.channel.hashID">

        <!--房间列表-->

            <KeepAlive>
                <RoomsList :key="curUserState.room.id" />
            </KeepAlive>

       <div class="w-full h-full">
           <!--默认窗口-->
           <KeepAlive>
               <HeroCard v-if="!curUserState.room"/>
           </KeepAlive>

           <transition name="fade" mode="out-in">

                   <template v-if="curUserState.room.type === 'Text'">
                       <!-- 聊天窗口 -->
                       <MessagesRoom :key="curUserState.room.id" />
                   </template>

                   <template v-else-if="curUserState.room.type === 'Voice'">
                       <!-- 语音窗口 -->
                       <VoiceRoom :key="curUserState.room.id" />
                   </template>

           </transition>
       </div>
    </div>


</template>

<script setup lang="ts">
import {onMounted, reactive, watch} from "vue";
import MessagesRoom from "./Room/components/Message/MessagesRoom.vue";
import Room from "./Room/RoomsList.vue";
import VoiceRoom from "./Room/components/Voice/VoiceRoom.vue";
import HeroCard from "./Room/components/HeroCard.vue";
import {useCurUserState} from "../../pinia/curUserState.ts";
import RoomsList from "./Room/RoomsList.vue";
import io from "socket.io-client";
import {useChannelState} from "../../pinia/ChannelState.ts";
import {useRoute} from "vue-router";
import axiosReq from "../../assets/js/axiosBase/axiosObject.js";

const curUserState = useCurUserState()
const channelState = useChannelState()
const route = useRoute()

// onMounted(()=>{
//     curUserState.room = {}
// })

const socket = io('http://127.0.0.1:42224/ws', {
    path: '/ws/'
});

// 加入频道 进入监听
socket.emit('joinChannel',curUserState.channel.hashID)
socket.on('joinedChannel',(r)=>{
    // console.log(r)
})

// 监听频道人数变化
watch(() => channelState.memberChangeFlag,()=>{
    if (channelState.memberChangeFlag){
        socket.emit('refresh')
        channelState.memberChangeFlag = !channelState.memberChangeFlag
    }
},{
    immediate:true,
    deep:true
})



onMounted(()=>{
    socket.on('refreshed',(roomsMember)=>{
        // console.log(roomsMember)
        channelState.roomsMember = roomsMember
        channelState.getRoomList(`/api/channel/${route.params.hashID}`)
    })
    // axiosReq.get("/api/demo").then(r=>{
    //     console.log(r)
    // })
})


</script>

<style scoped>

.fade-enter-from,
.fade-leave-to {
opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
transition: opacity 0.15s ease-in-out;
}

.fade-enter-to,
.fade-leave-from {
opacity: 1;
}
</style>