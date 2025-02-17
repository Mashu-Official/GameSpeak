<template>
    <div class="flex flex-row h-full w-full ">
        <div class="flex flex-1 flex-col items-start h-full relative pt-6">
            <div class="px-8 w-full mb-2">
                <div class="text-xl">{{ curUserState.room.name || "找不到该房间" }}</div>
                <div class="divide"></div>
            </div>

            <KeepAlive>
                <MessageCard/>
            </KeepAlive>

        </div>
        <RoomSidebar />
    </div>
</template>

<script setup lang="ts">
import MessageCard from "./MessageCard.vue";
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import RoomSidebar from "../../RoomSidebar.vue";


const curUserState = useCurUserState();
</script>