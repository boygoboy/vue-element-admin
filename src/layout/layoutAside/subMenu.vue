<script setup lang="ts" name="SubMenu">
import type { RouteRecordRaw } from 'vue-router';

defineProps<{
    menu: RouteRecordRaw
}>();
</script>

<template>
    <!-- 只有一级菜单，没有子菜单 -->
    <el-menu-item v-if="!menu.children || menu.children.length <= 0" 
        :index="menu.path">
        <SvgIcon v-if="menu.meta && menu.meta.icon" :name="menu.meta?.icon" />
        <template #title>
            <span>{{ menu.meta?.title }}</span>
        </template>
    </el-menu-item>
    <!-- 有子菜单 -->
    <el-sub-menu v-else :index="menu.path">
        <template #title>
            <SvgIcon v-if="menu.meta && menu.meta.icon" :name="menu.meta?.icon" />
            <span>{{ menu.meta?.title }}</span>
        </template>
        <!-- 引用当前组件，渲染子菜单，注意组件名SubMenu -->
        <SubMenu v-for="childMenu in menu.children" :menu="childMenu" :key="childMenu.path"/>
    </el-sub-menu>
</template>

<style scoped>

</style>