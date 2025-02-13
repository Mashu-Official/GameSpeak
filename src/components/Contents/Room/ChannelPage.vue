<template>
    <KeepAlive>
        <a-layout style="height: 100%">

            <a-layout-content style="background-color: transparent">
                <RoomContent/>
            </a-layout-content>

            <!--        <a-layout-sider :resize-directions="['left']" style="width: inherit;background-color: transparent;overflow: hidden">-->
<!--            <a-layout-sider style="width: inherit;background-color: transparent;overflow: hidden">-->
<!--                <RoomSidebar/>-->
<!--            </a-layout-sider>-->
        </a-layout>
    </KeepAlive>
</template>

<script setup lang="ts">
import RoomSidebar from "./RoomSidebar.vue";
import RoomContent from "./RoomContent.vue";
</script>

<style scoped>
.arco-resizebox-trigger-icon-wrapper {
    width: 4px;
}
</style>