<template>

    <div class="flex flex-1 flex-col items-start h-full min-w-[287px] px-8 relative">
        <div class="text-xl">{{ "temp" }}</div>

        <div class="divide mb-4" style="width: 100%"></div>

        <div class="flex flex-col w-full h-0 flex-1 justify-center items-center">
            <div class="text-3xl font-bold">temp</div>
        </div>

    </div>

</template>

<script setup lang="ts">
import {useCurUserState} from "../../../pinia/curUserState.js";

const curUserState = useCurUserState()
</script>

<style scoped>

</style>