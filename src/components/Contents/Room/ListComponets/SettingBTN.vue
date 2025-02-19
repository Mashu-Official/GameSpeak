<template>
    <div class="relative flex items-start">
        <button class="" @click="toggleSettingMenu">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.0003 41L44 24L34.0003 7H14.0002L4 24L14.0002 41H34.0003Z" fill="none"
                      stroke="currentColor"
                      stroke-width="4" stroke-linejoin="round"/>
                <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
                      fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
            </svg>
        </button>

        <!--        <div class="hoverTitle ViewCard py-2 hidden absolute right-8 whitespace-nowrap -mt-0.5" :class="{'invisible': channelSettingMenu}">-->
        <!--            设置-->
        <!--        </div>-->

        <div class="p-4 absolute right-4 -mt-8">
            <div class="ViewCard whitespace-nowrap hidden flex-col space-y-1 py-3 ">

            <div class="p-2 rounded-lg" @click="createRoom">
                新增房间
            </div>
            <div class="p-2 rounded-lg" @click="deleteRoom">
                删除房间
            </div>
        </div>
        </div>

        <CreateRoom class="select-none" :isOpenModal="isOpenModal" @openModal="handleModalChange"/>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import CreateRoom from "./CreateRoom.vue";

const channelSettingMenu = ref<boolean>(false)
const toggleSettingMenu = () => {
    channelSettingMenu.value = !channelSettingMenu.value
}

const isOpenModal = ref(false);
const createRoom = () => {
    console.log(isOpenModal.value)
    isOpenModal.value = true
}
const deleteRoom = () => {

}

const handleModalChange = (openModal) => {
    isOpenModal.value = openModal
}
</script>
<style scoped>

.relative button:hover + div .ViewCard {
    display: flex;
}

.relative div:hover .ViewCard {
    display: flex;
}

.ViewCard > div {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
}

.ViewCard > div:hover {
    background-color: var(--dark-card-color);
}
</style>