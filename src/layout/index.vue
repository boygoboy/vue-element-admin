<script setup lang="ts" name="Layout">
// 同步导入
// import LayoutAside from './layoutAside/index.vue';
// import LayoutHeader from './layoutHeader/index.vue';
// import LayoutMain from './layoutMain/index.vue';

import { defineAsyncComponent } from 'vue';
// 异步导入
const LayoutAside = defineAsyncComponent(() => import('./layoutAside/index.vue'));
const LayoutHeader = defineAsyncComponent(() => import('./layoutHeader/index.vue'));
const LayoutMain = defineAsyncComponent(() => import('./layoutMain/index.vue'));

</script>

<template>
    <el-container class="layout-container">
        <!--参考： https://element-plus.org/zh-CN/component/container.html -->
        <!-- 左侧菜单栏 -->
        <LayoutAside></LayoutAside>
        <!-- 右侧垂直 -->
        <el-container direction="vertical">
            <!-- 右侧头部区域 -->
            <LayoutHeader></LayoutHeader>
            <!-- 右侧主区域 -->
            <LayoutMain></LayoutMain>
        </el-container>
    </el-container>
</template>

<style>

</style>