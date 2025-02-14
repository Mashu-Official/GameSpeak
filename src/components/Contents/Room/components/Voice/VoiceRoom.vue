<template>

    <div class="flex flex-1 flex-col items-start h-full px-8 relative overflow-hidden">
        <div class="h-1/3 flex-shrink-0">
            <VoiceCard class="h-full"/>
        </div>


        <div class="flex w-full h-full justify-start ">
            <div class="flex flex-col flex-1 mt-4">
                <div class="text-xl ">{{ curUserState.room.name || "找不到该房间" }}</div>
                <div class="divide mb-4" style="width: 100%"></div>
                <MessageCard class="flex-1 h-full" :key="curUserState.room.id"/>
            </div>

            <RoomSidebar class="mt-4"/>
        </div>
    </div>

</template>

<script setup lang="ts">
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import {Messages} from "../../../../../interface&enum/Messages.ts";
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import {setWidth} from "../../../../../assets/js/dynamticOverflow.js";
import {useHorizontalScroll} from "../../../../../assets/js/HorizontalScroll.ts";
import {UserInVoiceRoom} from "../../../../../interface&enum/userInVoiceRoom.ts";
import UserCard from "../UserCard.vue";
import VoiceCard from "./VoiceCard.vue";
import MessageCard from "../Message/MessageCard.vue";
import RoomSidebar from "../../RoomSidebar.vue";

const curUserState = useCurUserState()




</script>

<style scoped>

</style>