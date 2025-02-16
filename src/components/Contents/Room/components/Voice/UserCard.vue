<template>

    <div class="box-border mb-2">
        <div class="flex flex-col ViewCard p-0 mx-1">

            <div class="rounded-lg  min-h-[128px] max-h-[128px] h-[128px] w-[242px] overflow-hidden object-center">
                <img class="rounded-lg inline-block object-cover object-center w-full h-full"
                     :src="user.avatar"
                     :alt="`[${user.name}]${user.avatar}`">
            </div>

            <div class="px-4 pb-2.5 pt-2">
                <span class="text-base">{{ user.username || user.name }}</span>

                <div class="flex flex-row items-center justify-between mt-2.5">

                    <div v-if="user.id === useCurUserState().userInfo.id"
                         class="flex flex-row items-center whitespace-nowrap">
                        <InputBTN :state="'self'" :displayPosition="'bottom'"/>
                        <div class="ml-2 text-sm">{{ useCurUserState().pressToSpeak ? '按键发言' : '自由发言' }}</div>
                    </div>

                    <div v-else></div>

                    <div></div>

                    <div class="flex flex-row items-center space-x-4">
                        <OutputBTN v-if="user.id === useCurUserState().userInfo.id" :state="'self'"
                                   :displayPosition="'bottom'"></OutputBTN>
                        <OutputBTN v-else :state="null" :displayPosition="'bottom'"/>

                        <!--退出按钮-->
                        <button v-if="user.id === useCurUserState().userInfo.id"
                                @click="useCurUserState().leaveRoom()">
                            <svg width="20" height="20" viewBox="0 0 48 48" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.9917 6H6V42H24" stroke="#ff0000" stroke-width="4"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M33 33L42 24L33 15" stroke="#ff0000" stroke-width="4"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M16 23.9917H42" stroke="#ff0000" stroke-width="4"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <!--踢人按钮-->
                        <button v-if="0"></button>
                    </div>
                </div>

            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import {UserInVoiceRoom} from "../../../../../interface&enum/userInVoiceRoom.ts";
import {ref} from "vue";
import {useCurUserState} from "../../../../../pinia/curUserState.ts";
import InputBTN from "../../ListComponets/InputBTN.vue";
import OutputBTN from "../../ListComponets/OutputBTN.vue";
import {useChannelState} from "../../../../../pinia/ChannelState.ts";

const user = ref<UserInVoiceRoom | any>()
const props = defineProps<{ user: UserInVoiceRoom }>();
// console.log(props)
if (props) {
    user.value = props.user
} else {
    user.value = null
}

// 如果需要对 props 进行日志记录或其他操作，可以在此进行
// console.log(props.user);
</script>

<style scoped>

</style>