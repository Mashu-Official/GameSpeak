<template>
    <div class="flex flex-col">
        <div class="flex flex-row text-lg font-semibold mb-2">
            用户管理
        </div>
        <div class="flex flex-row w-full space-x-24 items-center p-4 ViewCard">
            <a-space direction="vertical" size="large" fill class="w-full">

                <a-table
                        :columns="userColumns"
                        :data="userData"
                        :page-position="'bottom'"
                        @change="handleChange" >


                    <template #handle="{ record }">
                        <div class="flex flex-row space-x-2">
                            <a-button @click="" status="danger">封禁</a-button>
                            <a-button @click="" type="primary" :status="record.isAdmin ? 'success' : 'warning' ">{{ record.isAdmin ? '设为管理': '取消管理'}}</a-button>
                            <a-button @click="" type="primary" status="danger" >删除</a-button>
                        </div>
                    </template>

                </a-table>
            </a-space>
        </div>
    </div>
</template>

<script setup lang="ts">

import {reactive} from "vue";

enum PermissionGroup{
    Root = "Root",
    Member = "Member",
    Guest = "Guest",
}
interface User{
    id: number,
        userName: string,
        groupName: string | PermissionGroup,
        createdAt: string,
        isAdmin: Boolean,
}

const userColumns = [
    {
        title: '用户名',
        dataIndex: 'userName',
        sortable: {
            sortDirections: ['ascend', 'descend']
        }
    },
    {
        title: 'ID',
        dataIndex: 'id',
        sortable: {
            sortDirections: ['ascend', 'descend']
        },
    },
    {
        title: '权限组',
        dataIndex: 'groupName',
    },
    {
        title: '注册时间',
        dataIndex: 'createdAt',
        sortable: {
            sortDirections: ['ascend', 'descend']
        },
    },
    {
        title: '操作',
        slotName: 'handle',
    },
];
const userData = reactive<User[]>([
    {
        id: 1,
        userName: "Alice",
        groupName: "AdminGroup", // 假设为一个代表组名的字符串
        createdAt: "2023-04-01T10:00:00Z",
        isAdmin: true
    },
    {
        id: 2,
        userName: "Bob",
        groupName: "EditorGroup", // 假设为一个代表组名的字符串
        createdAt: "2023-05-15T14:30:00Z",
        isAdmin: false
    },
    {
        id: 3,
        userName: "Charlie",
        groupName: "ViewerGroup", // 假设为一个代表组名的字符串
        createdAt: "2023-06-22T09:15:00Z",
        isAdmin: false
    }
]);
</script>

<style scoped>

</style>