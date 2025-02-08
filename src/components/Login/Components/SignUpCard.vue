<template>
    <div class="flex flex-col">
        <div class="ViewCard flex flex-col pt-8 px-8 pb-4">
            <div class="mb-2">
                <div class="text-3xl font-bold">注册</div>
                <div class="divide border-2"></div>
            </div>
            <a-form :model="form" :style="{ width: '450px' }" :layout="'vertical'" @submit="loginSubmit()">
                <a-form-item field="username" label="用户名">
                    <a-input v-model="form.username"
                             placeholder="输入用户名"
                             :size="'large'"
                             allow-clear
                             :error="!form.username && haveInput[0]"
                    />
                </a-form-item>
                <a-form-item field="password" label="密码">
                    <a-input-password v-model="form.password"
                                      placeholder="输入密码"
                                      :size="'large'"
                                      allow-clear
                                      :error="!form.password && haveInput[1]"
                    />
                </a-form-item>
                <a-form-item field="password" label="再次输入密码">
                    <a-input-password v-model="form.password"
                                      placeholder="输入密码"
                                      :size="'large'"
                                      allow-clear
                                      :error="!form.password && haveInput[1]"
                    />
                </a-form-item>
                <a-form-item>
                    <div class="flex justify-start w-full">
                        <a-button  html-type="submit" :size="'large'">注册</a-button>


                        <div class="ml-12">
                            <span class="mr-2">已有账号？ 马上登录→ </span>
                            <RouterLink to="login">
                                <a-button  html-type="button" :size="'large'">登录</a-button>

                            </RouterLink>
                        </div>
                    </div>
                </a-form-item>



            </a-form>
        </div>

        <div class="ViewCard flex flex-col w-full my-4 p-8 oauthGroup">
            123
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

// 初始化 Toast
const toast = useToast();

// 输入状态数组
const haveInput = ref<boolean[]>([false, false]);

// 表单数据接口定义
interface LoginForm {
    username: string | null,
    password: string | null,
}

// 表单数据响应式引用
const form = ref<LoginForm>({
    username: null,
    password: null
});

// 验证输入函数
const verifyInput = () => {
    const fieldNames = {
        "username": "用户名",
        "password": "密码"
    };
    for (let key in form.value) {
        if (form.value.hasOwnProperty(key)) {
            const value = form.value[key];
            console.log([key, value]);
            if (!value) {
                const fieldName = fieldNames[key] || key;
                toast.warning(`${fieldName} 不能为空`);
                return false;
            }
        }
    }
    return true;
};

// 登录提交函数
const loginSubmit = () => {
    if (!verifyInput()) {
        return;
    }
    console.log(form.value);
    toast.success("登录成功，正在跳转");
};


watch(() => form.value.username, (newVal, oldVal) => {
    haveInput.value[0] = true;
    console.log(haveInput.value[0]);
});
watch(() => form.value.password, (newVal, oldVal) => {
    haveInput.value[1] = true;
});

</script>


<style scoped>

</style>