<script setup lang="ts" name="LayoutMain">
import { useViewRoutesStore } from "@/stores/viewRoutes";
import { computed } from 'vue';
const viewRoutesStore = useViewRoutesStore();

// 获取要缓存的路由name
const cacheRouteNames = computed(() => viewRoutesStore.cacheRouteNames);

</script>

<template>
    <el-main class="layout-main">
        <el-scrollbar>
            <div class="layout-main-warp">
                <router-view v-slot="{ Component }">
                    <transition name="fade-transform" mode="out-in">
                        <keep-alive :include="cacheRouteNames">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </el-scrollbar>
    </el-main>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
    /* 铺满高度 */
    height: 100%;
}
</style>