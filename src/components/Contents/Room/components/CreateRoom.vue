<template>
    <a-modal v-model:visible="localVisible" @ok="handleOk" @cancel="handleCancel">
        <template #title>
            <span class="text-lg font-bold">新建房间</span>
        </template>

        <a-space direction="vertical" size="medium" style="width: 100%">
            <a-form :model="form">
                <a-form-item field="roomName" label="房间名">
                    <a-input v-model="form.roomName" placeholder="房间名字"/>
                </a-form-item>
                <a-select v-model="form.type" placeholder="选择房间类型">
                    <a-option :value="'Both'">文字语音</a-option>
                    <a-option :value="'Voice'">语音</a-option>
                    <a-option :value="'Text'">文字</a-option>
                </a-select>
            </a-form>
            <div>
                {{ form }}
            </div>
        </a-space>

    </a-modal>
</template>

<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue';

const props = defineProps<{
    modelValue: boolean;
}>();

const value = ref();
const form = reactive({
    roomName: '',
    type: '',
})

const emit = defineEmits(['update:modelValue', 'submit']);

const localVisible = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const handleOk = () => {
    // 处理确认逻辑
    localVisible.value = false; // 关闭模态框l
    emit('submit', form)
};

const handleCancel = () => {
    // 处理取消逻辑
    localVisible.value = false; // 关闭模态框
};

const resetForm = () => {
    form.roomName = '';
    form.type = '';
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