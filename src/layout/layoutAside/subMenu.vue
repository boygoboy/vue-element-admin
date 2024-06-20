<template>
  <!-- 只有一级菜单，没有子菜单 -->
  <el-menu-item
    v-if="!menu.children || menu.children.length <= 0"
    :index="menu.path"
  >
    <icon-font
      v-if="menu.meta && menu.meta.icon"
      :icon-class="menu.meta?.icon"
      :color="menu.path == route.path ? '#fff' : '#8785b7'"
      size="1.1em"
    ></icon-font>
    <template #title>
      <span style="margin-left: 5px">{{ menu.meta?.title }}</span>
    </template>
  </el-menu-item>
  <!-- 有子菜单 -->
  <el-sub-menu v-else :index="menu.path">
    <template #title>
      <icon-font
        v-if="menu.meta && menu.meta.icon"
        :icon-class="menu.meta?.icon"
        :color="menu.path == route.path ? '#fff' : '#8785b7'"
        size="1.1em"
      ></icon-font>
      <span style="margin-left: 5px">{{ menu.meta?.title }}</span>
    </template>
    <!-- 引用当前组件，渲染子菜单，注意组件名SubMenu -->
    <SubMenu
      v-for="childMenu in menu.children"
      :menu="childMenu"
      :key="childMenu.path"
    />
  </el-sub-menu>
</template>

<script setup lang="ts" name="SubMenu">
import type { RouteRecordRaw } from "vue-router";
import { useRoute } from "vue-router";
const route = useRoute();

defineProps<{
  menu: RouteRecordRaw;
}>();
</script>

<style scoped></style>
