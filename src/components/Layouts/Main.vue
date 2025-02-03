<template>
    <div class="layout">

        <a-layout style="height: 100%">
            <a-layout-header>Header</a-layout-header>
            <a-layout>
                <a-layout-sider class="hidden sm:block overflow-visible" theme="dark" style="width: inherit;">
                    <SideCard />
                </a-layout-sider>
                <a-layout-content>Content</a-layout-content>
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
    color: var(--color-white);
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
}
.layout :deep(.arco-layout-header){
    -webkit-app-region: drag;
    height: 32px;
    background-color: var(--color-primary-light-4);
}


.layout :deep(.arco-layout-footer) {
    height: 64px;
    background-color: var(--color-primary-light-4);
}

.layout :deep(.arco-layout-sider) {
    width: 122px;
    background-color: var(--color-primary-light-3);
}

.layout :deep(.arco-layout-content) {
    background-color: rgb(var(--arcoblue-6));
}

</style>
<script setup>
import SideCard from "../SideBar/SideCard.vue";
</script>