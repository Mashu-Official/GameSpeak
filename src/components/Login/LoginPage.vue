<template>


    <div class="flex flex-row w-full h-full items-start overflow-hidden">
        <div class="flex-1  h-full" :style="backgroundImageStyle"
             style="
                background-repeat: no-repeat;
                background-position: top;
                background-size: cover;">


        </div>
        <div class="flex flex-col flex-1 items-center justify-center">

        </div>
    </div>

</template>

<script setup lang="ts">
import RoomSidebar from "../Contents/Room/RoomSidebar.vue";
import RoomContent from "../Contents/Room/RoomContent.vue";
import {computed} from "vue";

const backgroundImageStyle = computed(() => ({
    backgroundImage: `url('/LoginPage/LoginCoverTomori.png')`
}));
</script>

<style scoped>

</style>