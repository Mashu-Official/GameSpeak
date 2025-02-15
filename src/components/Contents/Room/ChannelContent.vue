<template>
    <div class="flex flex-1 flex-row w-full pl-2 pt-6">
        <!--房间列表-->
        <KeepAlive>
            <RoomsList/>
        </KeepAlive>
        <!--默认窗口-->
        <HeroCard v-if="!curUserState.room"/>

        <KeepAlive>
            <template  v-if="curUserState.room.type === 'Text'">
                <!--聊天窗口-->
                <MessagesRoom :key="curUserState.room.id"/>
            </template>
        </KeepAlive>


        <KeepAlive>
            <template v-if="curUserState.room.type === 'Voice' ">
                <!--语音窗口-->
                <VoiceRoom :key="curUserState.room.id"/>
            </template>
        </KeepAlive>
    </div>


</template>

<script setup lang="ts">
import {onMounted, reactive, watch} from "vue";
import MessagesRoom from "./components/Message/MessagesRoom.vue";
import Room from "./RoomsList.vue";
import VoiceRoom from "./components/Voice/VoiceRoom.vue";
import HeroCard from "./components/HeroCard.vue";
import {useCurUserState} from "../../../pinia/curUserState.ts";
import RoomsList from "./RoomsList.vue";
import io from "socket.io-client";
import {useChannelState} from "../../../pinia/ChannelState.ts";
import {useRoute} from "vue-router";

const curUserState = useCurUserState()
const channelState = useChannelState()
const route = useRoute()
onMounted(()=>{
    // curUserState.room = {}
})

const socket = io('http://127.0.0.1:42224/ws', {
    path: '/ws/'
});

// 加入频道 进入监听
socket.emit('joinChannel',curUserState.channel.hashID)
socket.on('joinedChannel',(r)=>{
    console.log(r)
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
        console.log(roomsMember)
        channelState.roomsMember = roomsMember
        channelState.getRoomList(`/api/channel/${route.params.hashID}`)
    })
})
</script>

<style scoped>

</style>