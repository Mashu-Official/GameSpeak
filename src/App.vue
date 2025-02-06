<script setup lang="ts">
import {useCurUserState} from "./pinia/curUserState.js";

useCurUserState().initSetting()

</script>

<template>

<RouterView/>

</template>
