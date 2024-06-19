<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFullscreen, useDark } from '@vueuse/core';
import { useLayoutConfigStore } from '@/stores/layoutConfig';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();

const layoutConfig = useLayoutConfigStore();

const authStore = useAuthStore();
const userInfo = computed(() => authStore.userInfo);

// 切换全屏模式 https://vueuse.org/core/useFullscreen/
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

async function handleToggleFullscreen() {
    await toggleFullscreen();
    //console.log('isFullscreen', isFullscreen.value);
    layoutConfig.isFullscreen = isFullscreen.value;
}

// 返回值是boolean当前是否为暗黑模式，并且会将这个状态值保存到localStorege中
// 会自动监听isDark变化，来设置对应的主题模式
const isDark = useDark({
    valueDark: 'dark',// 暗黑模式，在 html元素的class属性值
    valueLight: '', // 高亮模式，在 html元素的class属性值
    initialValue: 'dark', // 初始模式: dark|auto ( 高亮模式)
});

function changeDark (val:boolean) {
    console.log('changeDark', val)
    layoutConfig.isDrak = val;
}

</script>

<template>
    <div class="layout-header-user">
        <!-- 全屏 -->
        <div class="layout-header-user-icon" @click="handleToggleFullscreen">
            <SvgIcon name="ele-FullScreen"/>
        </div>
        <!-- 切换主题 -->
        <div class="layout-header-user-icon">
            <el-switch 
                v-model="isDark"
                @change="changeDark"
                inline-prompt
                style="--el-switch-on-color: #333;"
                active-icon="ele-Moon" inactive-icon="ele-Sunny"
            />
        </div>
        <!-- 下拉菜单 -->
        <el-dropdown>
            <span class="user-dropdown-link ml5">
                <!-- :src="circleUrl" -->
                <el-avatar class="mr3" :size="30" icon="ele-UserFilled" 
                    :src="userInfo?.imageUrl" />
                {{userInfo?.nickName}}
                <SvgIcon class="ml3" name="ele-ArrowDown"/>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="router.push('/')">首页</el-dropdown-item>
                    <el-dropdown-item @click="router.push('/401')">401</el-dropdown-item>
                    <el-dropdown-item @click="router.push('/404')">404</el-dropdown-item>
                    <el-dropdown-item @click="authStore.userLogout()" divided>退出系统</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<style scoped>

</style>