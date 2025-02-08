<template>


    <div class="flex flex-row w-full h-full items-start overflow-hidden">
        <div class="flex-1  h-full" :style="backgroundImageStyle">


        </div>
        <div class="flex flex-col flex-1 items-center justify-center">
            123123
        </div>
    </div>
    <!--    <div class="flex flex-row h-full w-full">-->
    <!--        <div class="flex-1 flex-shrink-0 h-full overflow-hidden"> &lt;!&ndash; 添加 overflow-hidden 来防止内容溢出 &ndash;&gt;-->

    <!--        </div>-->
    <!--        <div class="flex flex-row flex-1 items-center justify-center">-->
    <!--123-->
    <!--        </div>-->
    <!--    </div>-->
</template>

<script setup lang="ts">
import RoomSidebar from "../Contents/Room/RoomSidebar.vue";
import RoomContent from "../Contents/Room/RoomContent.vue";
import {computed} from "vue";
const backgroundImageStyle = computed(() => ({
    backgroundImage: `url('/LoginPage/LoginCoverTomori.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'top',
}));
</script>

<style scoped>

</style>