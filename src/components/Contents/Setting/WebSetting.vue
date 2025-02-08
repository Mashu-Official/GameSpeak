<template>
    <div class="flex flex-col w-full space-y-4">

        <div class="flex flex-col">
            <div class="flex flex-row text-lg font-semibold mb-2">
               用户 & 房间设置
            </div>
            <div class="flex flex-row w-full space-x-32 items-center px-11 py-8 ViewCard">
                <!--用户部分-->
                <div class="flex flex-col flex-1 space-y-4 items-start w-full">

                    <div class="flex flex-row space-x-6 w-full">
                        <span class="text-base font-bold flex-1">允许访客用户 </span>

                            <a-switch size="large"
                                      hecked-color="#F53F3F"/>

                    </div>

                    <div class="flex flex-row space-x-6 w-full">
                        <span class="text-base font-bold flex-1">禁止用户注册</span>

                        <a-switch size="large"
                                  hecked-color="#F53F3F"/>

                    </div>

                    <div class="flex flex-row space-x-6 w-full">
                        <span class="text-base font-bold flex-1">注册需要审核</span>
                        <!--待后端完成-->
                        <a-switch size="large"
                                  :disabled="true"
                                  hecked-color="#F53F3F"/>

                    </div>
                </div>
                <!--房间部分-->
                <div class="flex flex-col flex-1 space-y-4 items-start w-full">

                    <div class="flex flex-row space-x-6 w-full">
                        <span class="text-base font-bold flex-1">创造房间需要审核 </span>

                        <a-switch size="large"
                                  hecked-color="#F53F3F"/>

                    </div>

                    <div class="flex flex-row space-x-6 w-full">
                        <span class="text-base font-bold flex-1">禁止创造房间</span>

                        <a-switch size="large"
                                  hecked-color="#F53F3F"/>

                    </div>

                    <div class="flex flex-row space-x-6 w-full">
                        <span class="text-base font-bold flex-1">创造房间必须填写密码</span>
                        <!--待后端完成-->
                        <a-switch size="large"
                                  :disabled="true"
                                  hecked-color="#F53F3F"/>

                    </div>
                </div>
            </div>
        </div>

        <UserManagement/>

        <RoomManagement/>
    </div>
</template>

<script setup lang="ts">
import RoomManagement from "./Components/RoomManagement.vue";
import UserManagement from "./Components/UserManagement.vue";

const handleChange = (data, extra, currentDataSource) => {
    console.log('change', data, extra, currentDataSource)
}
</script>

<style scoped>

</style>