<template>
    <div class="flex flex-row w-full h-full items-start overflow-hidden select-none">
        <!-- 背景图片容器 -->
        <div class="flex-1 h-full" :style="backgroundImageStyle"
             style="background-repeat: no-repeat; background-position: top; background-size: cover;">
        </div>

        <!-- 登录 / 注册 -->
        <div class="flex flex-col flex-1 items-center justify-center h-full">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import LoginCard from "./Components/LoginCard.vue";

const backgroundImageStyle = computed(() => ({
    backgroundImage: `url('/LoginPage/LoginCoverTomori.png')`
}));
</script>

<style scoped>
.oauthGroup{

}
</style>