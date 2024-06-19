<script setup lang="ts" name="NoPermission">
// import { useRouter } from 'vue-router';
// const router = useRouter();

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <div class="error-container layout-padding flex-center">
        <img class="error-img" src="@/assets/401.svg"/>
        <div  class="error-wrap">
            <div  class="error-title">您没有操作权限，请联系管理员！</div>
            <div  class="error-msg">联系方式：https://www.mengxuegu.com</div>
            <el-button @click="authStore.userLogout()" type="primary" round>重新登录</el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.error-container {
    flex-direction: row !important;
    .error-img {
        width: 350px;
    }
    .error-wrap {
        margin-left: 50px;
        .error-title {
            font-size: 22px;
            font-weight: 600;
        }
        .error-msg {
            font-size: 13px;
            color: var(--el-color-info);
            margin: 10px 0 30px 0;
        }
    }
}
</style>