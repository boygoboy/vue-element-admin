import type { App } from "vue";
import { useAuthStore } from '@/stores/auth';
import { isContainArr } from '@/utils/validate';

/**
 * 自定义用户权限指令（按钮）
 * 1. v-auth='xxx' 单个权限校验
 * 2. v-auths=['aa', 'bb'] 只要满足数组中其中一个权限标识
 * 3. v-authAll=['aa', 'bb'] 要满足数组中所有权限标识
 * @param app App实例
 */
export async function authDirective(app: App) {
    const authStore = useAuthStore();

    // 1. v-auth='xxx' 单个权限校验
    // 注意：指令名不加上 v- ，使用时 v-开头： v-auth
    app.directive('auth', {
        mounted(el, binding) {
            // 获取用户所拥有的所有按钮权限标识
            const buttonList = authStore.buttonList;
            // 如果没有权限，将元素移除
            if (!buttonList.some(btn => btn === binding.value)) {
                el.parentNode.removeChild(el);
            }
        }
    });


    // 2. v-auths=['aa', 'bb'] 只要满足数组中其中一个权限标识
    app.directive('auths', {
        mounted(el, binding) {
            // 获取用户所拥有的所有按钮权限标识
            const buttonList = authStore.buttonList;
            if (!buttonList.some(btn => binding.value.indexOf(btn) !== -1 )) {
                el.parentNode.removeChild(el);
            }
        }
    });

    // 3. v-authAll=['aa', 'bb'] 要满足数组中所有权限标识
    app.directive('authAll', {
        mounted(el, binding) {
            // 获取用户所拥有的所有按钮权限标识
            const buttonList = authStore.buttonList;
            if (!isContainArr(buttonList, binding.value)) {
                el.parentNode.removeChild(el);
            }
        }
    });
}