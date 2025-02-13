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
import {reactive} from "vue";
import MessagesRoom from "./components/MessagesRoom.vue";
import Room from "./RoomsList.vue";
import VoiceRoom from "./components/VoiceRoom.vue";
import HeroCard from "./components/HeroCard.vue";
import {useCurUserState} from "../../../pinia/curUserState.ts";
import RoomsList from "./RoomsList.vue";

const curUserState = useCurUserState()

</script>

<style scoped>

</style>