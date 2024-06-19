<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useLayoutConfigStore } from '@/stores/layoutConfig';
import { storeToRefs } from 'pinia';

const route = useRoute();
const layoutConfig = useLayoutConfigStore();
const { isCollapse } = storeToRefs(layoutConfig);

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
            <el-menu-item index="/home">
                <SvgIcon name="ele-HomeFilled" />
                <span>首页</span>
            </el-menu-item>
            <el-sub-menu index="/system">
                <template #title>
                    <SvgIcon name="ele-Setting" />
                    <span>系统管理</span>
                </template>
                <el-menu-item index="/system/menu">
                    <template #title>
                        <SvgIcon name="ele-Menu"/>
                        <span>菜单管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/system/role">
                    <template #title>
                        <SvgIcon name="ele-IceCream"/>
                        <span>角色管理</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/system/user">
                    <template #title>
                        <SvgIcon name="ele-User"/>
                        <span>用户管理</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/goods">
                <template #title>
                    <SvgIcon name="ele-Goods" />
                    <span>商品管理</span>
                </template>
                <el-menu-item index="/goods/list">
                    <template #title>
                        <SvgIcon name="ele-GoodsFilled"/>
                        <span>商品列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/goods/category">
                    <template #title>
                        <SvgIcon name="ele-Operation"/>
                        <span>商品分类</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/mengxuegu">
                <SvgIcon name="ele-Link" />
                <span>梦学谷官网</span>
            </el-menu-item>
            <el-menu-item index="/401">
                <SvgIcon name="ele-Warning" />
                <span>401页面</span>
            </el-menu-item>
        </el-menu>
    </el-scrollbar>
</template>

<style scoped>

</style>