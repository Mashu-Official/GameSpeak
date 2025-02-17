<template>
    <a-modal v-model:visible="localVisible" @ok="handleOk" @cancel="handleCancel">
        <template #title>
            <span class="text-lg font-bold">新建房间</span>
        </template>

        <a-space direction="vertical" size="medium" style="width: 100%">
            <a-form :model="form">
                <a-form-item field="roomName" label="房间名">
                    <a-input v-model="form.roomName"
                             :validate-status="status"
                             feedback
                             placeholder="输入房间名字"/>
                </a-form-item>
                <a-form-item field="type" label="房间类型">
                    <a-select v-model="form.type" placeholder="选择房间类型：语音 / 文字房间">
                        <a-option :value="'Voice'">语音</a-option>
                        <a-option :value="'Text'">文字</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="type" label="房间是否上锁">
                    <a-select v-model="form.lock" placeholder="是否上锁">
                        <a-option :value="true">是</a-option>
                        <a-option :value="false">否</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="form.lock" field="type" label="密码（可选）">
                    <a-input v-model="form.password" placeholder="输入房间密码"/>
                </a-form-item>
                <a-form-item v-if="form.lock" field="type" label="权限组设置">

                </a-form-item>
                <a-transfer
                        v-if="form.lock"
                        :data="data"
                        :default-value="value"
                />
                <!--                ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓-->
                <!--                source-title="'权限组'"-->
                <!--                target-title="'允许进入的权限组'"-->
                <!--             ↑↑↑↑↑↑↑↑↑↑↑↑↑   slot ↑↑↑↑↑↑↑↑↑↑↑-->

                <!--                show-search-->
                <!--                :source-input-search-props="{-->
                <!--                placeholder:'source item search'-->
                <!--                }"-->
                <!--                :target-input-search-props="{-->
                <!--                placeholder:'target item search'-->
                <!--                }"-->
            </a-form>
            <!--            <div>-->
            <!--                {{ form }}-->
            <!--            </div>-->
        </a-space>

    </a-modal>
</template>

<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue';
import {newRoom} from "../../../../interface&enum/newRoom.ts";
import {RoomType} from "../../../../interface&enum/RoomTypeEnum.ts";
import axiosReq from "../../../../assets/js/axiosBase/axiosObject.js";
import {useRoute} from "vue-router";
import {useCurUserState} from "../../../../pinia/curUserState.ts";

const status = ref('');

const props = defineProps<{
    isOpenModal: boolean;
}>();

const data = [
    {
        value: 123,
        label: 123,
    },
    {
        value: 1234,
        label: 1234,
    },
]

const route = useRoute()
const value = ref();
const initialForm: newRoom = {
    roomName: '',
    type: '' as RoomType,
    lock: false,
    password: null,
};

// 创建响应式表单对象
const form = reactive<newRoom>(initialForm);
const emit = defineEmits(['openModal']);

const localVisible = computed({
    get() {
        return props.isOpenModal;
    },
    set(value) {
        emit('openModal', value);
    }
});

const handleOk = async () => {
    if (form.roomName === "") {
        return
    }
    const res = await axiosReq.post(`/api/channel/${route.params.hashID}`, form)

    if (res.status === 200) {
        useCurUserState().SocketChannel.emit('refresh')
    }
    // 处理确认逻辑
    localVisible.value = false; // 关闭模态框

};

const handleCancel = () => {
    // 处理取消逻辑
    localVisible.value = false; // 关闭模态框
};

const resetForm = () => {
    form.roomName = '';
    form.type = '';
    form.lock = false;
    form.password = ''
}

// 在关闭模态框时重置表单数据
watch(localVisible, (newValue) => {
    setTimeout(() => {
        if (!newValue) {
            resetForm();
        }
    }, 200)
});
</script>

<style scoped>
/* 样式 */
</style>