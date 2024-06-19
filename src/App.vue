<script setup lang="ts" name="App">
import { Local } from '@/utils/storage';
import { onMounted } from 'vue';
import { useLayoutConfigStore } from '@/stores/layoutConfig';

const layoutConfig = useLayoutConfigStore();

onMounted(() => {
  // 获取localStorage中的布局配置数据，
  const layoutConfigState = Local.get('layoutConfig');
  // 更新到pinia状态中
  if (layoutConfigState) layoutConfig.updateState(layoutConfigState);
});

</script>

<template>
  <div class="h100">
    <!-- 路由组件渲染出口 -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>
