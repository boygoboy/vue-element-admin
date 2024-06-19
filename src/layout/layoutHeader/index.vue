<script setup lang="ts" name="LayoutHeader">
import { defineAsyncComponent } from 'vue';

const Breadcrumb = defineAsyncComponent(() => import('@/layout/layoutHeader/breadcrumb.vue'));
const UserDropdown = defineAsyncComponent(() => import('@/layout/layoutHeader/userDropdown.vue'));

</script>

<template>
    <el-header class="layout-header">
        <div class="layout-header-index">
            <!-- 面包屑 -->
            <Breadcrumb />
            <!-- 右侧下拉菜单 -->
            <UserDropdown/>
        </div>
    </el-header>
</template>

<style scoped>

</style>