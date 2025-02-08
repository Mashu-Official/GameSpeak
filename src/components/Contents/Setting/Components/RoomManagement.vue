<template>
    <div class="flex flex-col">
        <div class="flex flex-row text-lg font-semibold mb-2">
            房间管理
        </div>
        <div class="flex flex-row w-full space-x-24 items-center p-4 ViewCard">
            <a-space direction="vertical" size="large" fill class="w-full">

                <a-table
                        :columns="roomColumns"
                        :data="roomData"
                        :page-position="'bottom'"
                        @change="handleChange"
                        :scroll="scrollPercent"
                        :scrollbar="scrollbar">
                    <!--                        pagination-->

                    <template #handle="{ record }">
                        <div class="flex flex-row space-x-2">
                            <a-button @click="" status="danger">封禁</a-button>
                            <a-button @click="" type="primary" status="danger" >删除</a-button>
                        </div>
                    </template>

                </a-table>
            </a-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import {RoomType} from "../../../../interface&enum/RoomTypeEnum.ts";


const scrollbar = ref(true);
const scroll = {
    x: 1080,
};
const scrollPercent = {
    x: '120%',
    y: '100%'
};


interface Room {
    id: number,
    name: string,
    type: RoomType,
    curMemberNum: number,
    memberLimit: number,
    creator: string,
    password: boolean,
}

const roomColumns = [
    {
        title: '房间名',
        dataIndex: 'name',
    },
    {
        title: 'ID',
        dataIndex: 'id',
        sortable: {
            sortDirections: ['ascend', 'descend']
        },
    },
    {
        title: '创建人',
        dataIndex: 'creator',
    },
    {
        title: '在线人数',
        dataIndex: 'curMemberNum',
        sortable: {
            sortDirections: ['ascend', 'descend']
        },
    },
    {
        title: '人数上限',
        dataIndex: 'memberLimit',
        sortable: {
            sortDirections: ['ascend', 'descend']
        },
    },
    {
        title: '房间类型',
        dataIndex: 'type',
    },
    {
        title: '密码保护',
        dataIndex: 'password',
    },
    {
        title: '操作',
        slotName: 'handle',
    },
];


const roomData = reactive<Room[]>( [
    {
        id: 1,
        name: "Lobby Chat",
        type: RoomType.Text, // 文字聊天室
        curMemberNum: 45,
        memberLimit: 100,
        creator: "user1",
        password: false // 不需要密码
    },
    {
        id: 2,
        name: "Gaming Voice",
        type: RoomType.Voice, // 语音聊天室
        curMemberNum: 10,
        memberLimit: 20,
        creator: "user2",
        password: true // 需要密码
    },
    {
        id: 3,
        name: "Community Hub",
        type: RoomType.Both, // 同时支持语音和文字的聊天室
        curMemberNum: 30,
        memberLimit: 50,
        creator: "user3",
        password: true // 需要密码
    }
])


</script>

<style scoped>

</style>