<template>
    <KeepAlive>
        <a-layout style="height: 100%">

            <a-layout-content style="background-color: transparent">
                <ChannelContent />
            </a-layout-content>

        </a-layout>
    </KeepAlive>
</template>

<script setup lang="ts">
import ChannelContent from "./ChannelContent.vue";

</script>

<style scoped>
.arco-resizebox-trigger-icon-wrapper {
    width: 4px;
}
</style>