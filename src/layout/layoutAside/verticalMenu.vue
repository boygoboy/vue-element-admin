<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useLayoutConfigStore } from '@/stores/layoutConfig';
import { storeToRefs } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const SubMenu = defineAsyncComponent(() => import('@/layout/layoutAside/subMenu.vue'));


const route = useRoute();
const layoutConfig = useLayoutConfigStore();
const { isCollapse } = storeToRefs(layoutConfig);

// 定义props 接收父组件传递的数据
withDefaults(defineProps<{
    menuList: RouteRecordRaw[],
}>(), {
    menuList: () => []
});

</script>

<template>
    <el-scrollbar>  <!--滚动条  -->
        <!-- router 等价于 :router="true" 开启路由模式 index指定路由path
        default-active 默认选中哪个菜单
        collapse 是否收起菜单
        -->
        <el-menu
            router
            :default-active="route.path"
            background-color="transparent"
            :default-openeds="['/system']"
            :collapse="isCollapse"
        >
            <SubMenu v-for="menu in menuList" :key="menu.path" :menu="menu"/>
        </el-menu>
    </el-scrollbar>
</template>

<style scoped>

</style>