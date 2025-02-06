<template>
    <div class="flex flex-1 flex-row w-full pl-2 pt-6">
<!--房间列表-->
        <RoomsList/>

        <!--默认窗口-->
        <HeroCard v-if="!curUserState.room"/>
        <div v-else>
            <!--聊天窗口-->
            <MessagesCard v-if="curUserState.room.type === 'Text'" />
            <!--语音窗口-->
            <VoiceCard v-if="curUserState.room.type === 'Voice' " />
        </div>
    </div>


</template>

<script setup lang="ts">
import {reactive} from "vue";
import MessagesCard from "../FuncCard/MessagesCard.vue";
import RoomsList from "./RoomsList.vue";
import VoiceCard from "../FuncCard/VoiceCard.vue";
import HeroCard from "../FuncCard/HeroCard.vue";
import {useCurUserState} from "../../../pinia/curUserState.js";
const curUserState = useCurUserState()

</script>

<style scoped>
.messageTime{
    font-size: 12px;
}

</style>