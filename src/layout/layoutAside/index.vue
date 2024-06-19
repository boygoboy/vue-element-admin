<script setup lang="ts"  name="LayoutAside">
import { defineAsyncComponent } from 'vue';
import { useLayoutConfigStore } from '@/stores/layoutConfig';
import { useAuthStore } from '@/stores/auth';
import type { RouteRecordRaw } from 'vue-router';
import { reactive, onMounted } from 'vue';

const Logo = defineAsyncComponent(() => import('@/layout/layoutAside/logo.vue'));
const VerticalMenu = defineAsyncComponent(() => import('@/layout/layoutAside/verticalMenu.vue'));

const layoutConfig = useLayoutConfigStore();


// 动态渲染菜单逻辑
const authStore = useAuthStore();
// console.log('menuList', authStore.menuList)

const state = reactive({
    // 要渲染的菜单数据
    menuList: [] as RouteRecordRaw[],
});

onMounted(() => {
    setFilterRoutes();
});

function setFilterRoutes() {
    const _filterRoutes = (routes: RouteRecordRaw[]) => {
        // 过滤出 不隐藏 的菜单
        const targetRoutes = routes.filter(item => !item.meta?.hidden);
        targetRoutes.forEach(item => {
            if (item.children && item.children.length > 0) {
                item.children = _filterRoutes(item.children)
            }
        });
        return targetRoutes;
    }
    // 拷贝一份，为了不影响pinia中的状态
    const copyMenuList = JSON.parse(JSON.stringify(authStore.menuList));
    state.menuList = _filterRoutes(copyMenuList);
}
</script>

<template>
    <!-- 左侧菜单栏 -->
    <div class="h100">
        <el-aside 
            class="layout-aside"
            :class="layoutConfig.isCollapse ? 'layout-aside-menu-60' : 'layout-aside-menu-200'"
            >
            <Logo />
            <VerticalMenu :menuList="state.menuList"/>
        </el-aside>
    </div>
</template>

<style scoped>

</style>