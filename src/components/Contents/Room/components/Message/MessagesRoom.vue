<template>
    <div class="flex flex-1 flex-col items-start h-full px-8 relative">
        <div class="text-xl">{{ curUserState.room.name || "找不到该房间" }}</div>

        <div class="divide mb-2" style="width: 100%"></div>

       <KeepAlive>
           <MessageCard/>
       </KeepAlive>
    </div>
    <RoomSidebar class=""/>
</template>

<script setup lang="ts">
import MessageCard from "./MessageCard.vue";
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import RoomSidebar from "../../RoomSidebar.vue";


const curUserState = useCurUserState();
</script>