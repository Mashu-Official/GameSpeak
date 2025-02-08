<template>

    <div class="flex flex-col ViewCard p-0">
        <div class="h-[148px] w-[246px] rounded-xl">
            <img class="rounded-xl h-full w-full inline-block object-cover"
                 :src="user.avatar"
                 :alt="`[${user.username || user.name}]${user.avatar}`">
        </div>

        <div class="px-4 pb-4 pt-2">
            <span class="text-base">{{ user.username || user.name }}</span>

            <div class="flex flex-row items-center justify-between mt-1">

                <button v-if="user.name" class="flex flex-row items-center whitespace-nowrap">
                    <svg v-show="1" width="20" height="20" viewBox="0 0 48 48" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor"
                              stroke-width="4"
                              stroke-linejoin="round"/>
                        <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23"
                              stroke="currentColor"
                              stroke-width="4"
                              stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                    <svg v-show="" width="20" height="20" viewBox="0 0 48 48" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <rect x="17" y="4" width="14" height="27" rx="7" fill="none" stroke="currentColor"
                              stroke-width="4"
                              stroke-linejoin="round"/>
                        <path d="M9 23C9 31.2843 15.7157 38 24 38C32.2843 38 39 31.2843 39 23"
                              stroke="currentColor"
                              stroke-width="4"
                              stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M24 38V44" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
                    </svg>
                    <span class="ml-2 text-sm">{{ true ? '按键发言' : '自由发言'}}</span>
                </button>
                <div v-else></div>

                <div></div>

                <div class="flex flex-row items-center space-x-4">
                    <button class="mb-[1px]">
                        <svg v-show="1" width="20" height="20" viewBox="0 0 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                                  stroke="currentColor"
                                  stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z"
                                  fill="none"
                                  stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                            <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                                  fill="currentColor"/>
                            <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z"
                                  fill="currentColor"/>
                            <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z"
                                  fill="none"
                                  stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                        </svg>
                        <svg v-show="" width="20" height="20" viewBox="0 0 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M42 30V24.4615C42 14.2655 33.9411 6 24 6C14.0589 6 6 14.2655 6 24.4615V30"
                                  stroke="currentColor"
                                  stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M34 32C34 29.7909 35.7909 28 38 28H42V42H38C35.7909 42 34 40.2091 34 38V32Z"
                                  fill="none"
                                  stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                            <path d="M42 32H44C45.1046 32 46 32.8954 46 34V36C46 37.1046 45.1046 38 44 38H42V32Z"
                                  fill="currentColor"/>
                            <path d="M6 32H4C2.89543 32 2 32.8954 2 34V36C2 37.1046 2.89543 38 4 38H6V32Z"
                                  fill="currentColor"/>
                            <path d="M6 28H10C12.2091 28 14 29.7909 14 32V38C14 40.2091 12.2091 42 10 42H6V28Z"
                                  fill="none"
                                  stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
                            <line x1="0" y1="0" x2="48" y2="48" stroke="#ff0000ff" stroke-width="5"/>
                        </svg>
                    </button>
                    <!--踢人按钮-->
                    <!--                                    <button>-->
                    <!--                                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none"-->
                    <!--                                             xmlns="http://www.w3.org/2000/svg">-->
                    <!--                                            <path d="M23.9917 6H6V42H24" stroke="#ff0000" stroke-width="4"-->
                    <!--                                                  stroke-linecap="round"-->
                    <!--                                                  stroke-linejoin="round"/>-->
                    <!--                                            <path d="M33 33L42 24L33 15" stroke="#ff0000" stroke-width="4"-->
                    <!--                                                  stroke-linecap="round"-->
                    <!--                                                  stroke-linejoin="round"/>-->
                    <!--                                            <path d="M16 23.9917H42" stroke="#ff0000" stroke-width="4"-->
                    <!--                                                  stroke-linecap="round"-->
                    <!--                                                  stroke-linejoin="round"/>-->
                    <!--                                        </svg>-->
                    <!--                                    </button>-->
                </div>
            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
import {UserInVoiceRoom} from "../../../interface&enum/userInVoiceRoom.ts";
import {ref} from "vue";

const user = ref<UserInVoiceRoom | any>()
const props = defineProps<{ user: UserInVoiceRoom }>();
// console.log(props)
if (props){
    user.value = props.user
}
else {
    user.value = null
}

// 如果需要对 props 进行日志记录或其他操作，可以在此进行
// console.log(props.user);
</script>

<style scoped>

</style>