<template>
    <div class="flex flex-col items-start h-full min-w-[262px] relative px-6 channelMemberListContainer">
        <template v-if="curUserState.channel"> 

            <div class="text-xl">在线成员</div>
            <div class="divide mb-2" style="width: 100%"></div>

            <div class="memberList w-full flex-1">
                <!--房间列表-->
                <div class="m-0 p-0 relative text-sm h-0 flex-1">
                    <div class="memberItem py-2 px-4 cursor-pointer mb-[2px]">
                        <div class="flex flex-row items-center">
                            <img class="circle w-9 h-9" src="https://cdn.jsdelivr.net/gh/Mashu-Official/Blog_IMG-Cabin/img/%E5%90%A7%E5%94%A72.png" alt="">
                            <span class="whitespace-nowrap ml-4 font-semibold">name</span>
                        </div>
                    </div>
                </div>

            </div>

        </template>

    </div>
</template>

<script setup>

import {useCurUserState} from "@/pinia/curUserState.ts";

const curUserState = useCurUserState()
</script>

<style scoped>
.memberList{
    overflow-y: auto;
    flex: 1;
    flex-shrink: 0;
}

/* 设置滚动条的宽度 */
.memberList::-webkit-scrollbar {
    width: 3px;
    display: block;
}

/* 设置滚动条的背景 */
.memberList::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
}

:is(.dark .memberList)::-webkit-scrollbar-track {
    background: #a2a2a2;
    border-radius: 10px;
}

/* 设置滚动条的滑块 */
.memberList::-webkit-scrollbar-thumb {
    background: #a2a2a2;
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

:is(.dark .memberList)::-webkit-scrollbar-thumb {
    background: #ffffff; /* 滚动条滑块的颜色 */
    border-radius: 10px;
    /*transition: background 0.3s ease-in-out;*/
}

.memberList::-webkit-scrollbar-thumb:hover {
    background: #464646
}

.memberList::-webkit-scrollbar-corner {
    background: #f1f1f1;
}


.memberItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.75rem;
    transition: background-color ease-in-out 0.15s;
}

.memberItem:hover {
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

:is(.dark .memberItem:hover) {
    background-color: rgb(28 28 32 / var(--tw-bg-opacity));
}
</style>