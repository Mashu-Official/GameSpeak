<template>
    <div class="flex flex-1 flex-row w-full pl-2 pt-6">
        <!--房间列表-->
        <KeepAlive>
            <RoomsList/>
        </KeepAlive>
        <!--默认窗口-->
        <HeroCard v-if="!curUserState.room"/>

        <!--聊天窗口-->
        <KeepAlive>
            <MessagesCard v-if="curUserState.room.type === 'Text'"/>
        </KeepAlive>
        <!--语音窗口-->
        <KeepAlive>
            <VoiceCard v-if="curUserState.room.type === 'Voice' "/>
        </KeepAlive>
        <!--        </div>-->
    </div>


</template>

<script setup lang="ts">
import {reactive} from "vue";
import MessagesCard from "../FuncCard/MessagesCard.vue";
import Room from "./RoomsList.vue";
import VoiceCard from "../FuncCard/VoiceCard.vue";
import HeroCard from "../FuncCard/HeroCard.vue";
import {useCurUserState} from "../../../pinia/curUserState.ts";

const curUserState = useCurUserState()

</script>

<style scoped>
.messageTime {
    font-size: 12px;
}

</style>