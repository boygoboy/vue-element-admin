<script setup lang="ts">
import { useLayoutConfigStore } from '@/stores/layoutConfig';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';

const route = useRoute();
const router = useRouter();

const layoutConfig = useLayoutConfigStore();

// 面包屑渲染数据
const breadcrumdList = ref<RouteRecordNormalized[]>([]);

// 用于第1次加载组件时触发
onMounted(() => {
    getBreadcrumb(route);
});

// 路由更新时会被触发，第n+1次
onBeforeRouteUpdate((to) => {
    //console.log('onBeforeRouteUpdate', to)
    getBreadcrumb(to);
});

/**
 * 获取当前路由的面包屑
 * @param to 目标路由对象
 */
function getBreadcrumb(to:RouteLocationNormalized) {
    //console.log('getBreadcrumb', to.matched)
    // isBreadcrumd不为false则显示菜单标题（true或没有值则显示）且meta.title要有值才显示
    const matched = to.matched.filter(item => item.meta && item.meta.title && item.meta.isBreadcrumd !== false);
    //console.log('matched', matched)
    breadcrumdList.value = matched;
}

// 点击面包屑的某标题进行路由跳转
function handleLink(_route:RouteRecordNormalized) {
    //console.log('handleLink', _route)
    const {redirect, path} = _route;
    if (redirect) router.push(<string>redirect);
    else router.push(path);
}


// 点击展开/收起左侧菜单
function handleChangeCollapse() {
    layoutConfig.isCollapse = !layoutConfig.isCollapse;
}
</script>

<template>
    <div class="layout-header-breadcrumb">
        <!-- 收缩图标 -->
        <SvgIcon 
            @click="handleChangeCollapse" 
            :name="layoutConfig.isCollapse ? 'ele-Expand': 'ele-Fold'" 
            class="layout-header-expand-icon"/>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item> -->
            <el-breadcrumb-item
                v-for="(item, index) in breadcrumdList" :key="item.path"
            >
                <!-- 最后一个项不点击跳转（当前页面的路由） -->
                <span v-if="index === breadcrumdList.length-1" class="flex-center">
                    <SvgIcon v-if="item.meta.icon" :name="item.meta.icon" :size="14"/>
                    {{item.meta.title}}
                </span>
                <!-- 其他项可点击路由跳转 -->
                <a v-else @click.prevent="handleLink(item)" class="flex-center">
                    <SvgIcon v-if="item.meta.icon" :name="item.meta.icon" :size="14"/>
                    {{item.meta.title}}
                </a>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<style scoped>

</style>