<script setup lang="ts" name="NotFound">
import { useRouter } from 'vue-router';
const router = useRouter();

</script>

<template>
    <div class="error-container layout-padding" >
        <img class="error-img" src="@/assets/404.svg"/>
        <div  class="error-wrap">
            <div class="error-title">您所访问的页面不存在！</div>
            <div class="error-msg">请检查您输入的网址是否正确，或点击下面的按钮返回首页。</div>
            <el-button @click="router.push('/')" round type="primary">返回首页</el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.error-container {
    display: flex;
    flex-direction: row !important;
    align-items: center;
    justify-content: center;
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