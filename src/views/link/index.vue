<script setup lang="ts" name="RouterViewLink">
import { useRoute } from 'vue-router';
import { watch, reactive } from 'vue';
import { validateURL } from '@/utils/validate';

const route = useRoute();

// 当前项目域名
const hostname = window.location.hostname;

const state = reactive({
    title: '', // 链接标题
    link: '', // 目标跳转url
})

// 监听路由变化
watch(() => route.path, () => {
    state.title = route.meta?.title || '外链';
    state.link = route.meta?.linkTo || '';
}, {immediate: true}); // 立即执行

// 点击继续访问
function handleOpenPage() {
    const {origin, pathname} = window.location;
    // http://localhost:8080 /mengxuegu
    console.log(origin, pathname);
    if (validateURL(state.link)) window.open(state.link);
    else window.open(`${origin}${state.link}`);
}
</script>

<template>
    <div class="link-container layout-padding flex-column-center">
      <img class="link-img" src="@/assets/link.svg">
      <div class="link-wrap">
        <h3>即将跳转到外部网站[{{ state.title }}]</h3>
        <div>您将要访问的链接不属于 {{ hostname }}，请关注您的帐号安全！</div>
        <div> {{ state.link }} </div>
        <el-button @click="handleOpenPage" class="link-btn" round>继续前往访问</el-button>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.link-container {
    .link-img {
        width: 200px;
    }
    .link-wrap {
        width: 500px;
        border: 1px solid var(--mxg-border-color-light);
        border-radius: 10px;
        padding: 20px;
        line-height: 30px;
        font-size: 15px;
        margin-top: 20px;
        .link-btn {
            float: right;
        }
    }

}
</style>