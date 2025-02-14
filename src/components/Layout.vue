<template>
    <div class="layout">

        <a-layout style="height: 100%">
            <a-layout-header class="p-0">
                <LayoutHeader />
            </a-layout-header>
            <a-layout>
                <a-layout-sider class="hidden sm:block overflow-visible"  style="width: 74px">
                    <SideCard />
                </a-layout-sider>
                <a-layout-content>
                    <LayoutContent />
                </a-layout-content>

            </a-layout>
<!--            <a-layout-footer>Footer</a-layout-footer>-->
        </a-layout>


    </div>
</template>

<style scoped>

.layout{
    height: 100%;
}
.layout :deep(.arco-layout-header),
.layout :deep(.arco-layout-footer),
.layout :deep(.arco-layout-sider-children),
.layout :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.layout :deep(.arco-layout-header),
.layout :deep(.arco-layout-footer),
.layout :deep(.arco-layout-sider-children),
.layout :deep(.arco-layout-content) {
    background-color: transparent;

}

.layout :deep(.arco-layout-header){
    -webkit-app-region: drag;
    height: 32px;
    /*background-color: var(--color-primary-light-4);*/
}

.layout :deep(.arco-layout-sider) {
    box-shadow: none;
    border: none;
}

.layout :deep(.arco-layout-content) {

}

</style>
<script setup>
import SideCard from "./Layouts/LayoutSideBar/LayoutSideCard.vue";
import LayoutHeader from "./Layouts/LayoutHeader.vue";
import LayoutContent from "./Layouts/LayoutContent.vue";
import {initThemeBtn, useThemeStore} from "../pinia/themeStore.js";
import {onMounted} from "vue";

onMounted(()=>{
    initThemeBtn()
})

</script>