import { defineStore } from 'pinia';
import { Local } from '@/utils/storage';
import { nextTick } from 'vue';

export const useLayoutConfigStore = defineStore('layoutConfig', {
    state: ():LayoutConfigState => {
        return {
            // 是否折叠起菜单：true折叠，false展开
            isCollapse: false,
            // 网站主标题
            globalTitle: 'vue-element-admin',
            isFullscreen: false, // 是否全屏状态：true是
            isDrak: false, // 是否暗黑主题：true是
        }
    },
    getters: {
    },
    actions: {
        // 更新状态
        updateState(state: LayoutConfigState) {
            // 将传递的对象属性值更新到state状态中
            this.$patch(state);
        }
    }
});

nextTick(() => {
    const layoutConfig = useLayoutConfigStore();
    // 监听状态变化，将状态执行化
    layoutConfig.$subscribe((mutation, state) => {
        // 保存到浏览器localStorage中
        Local.set('layoutConfig', state);
    });
});



