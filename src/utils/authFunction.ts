import { useAuthStore } from "@/stores/auth";
import { isContainArr } from '@/utils/validate';

/**
 * 根据用户拥有的权限标识 buttonList 来判断是否拥有对应权限
 *  1. auth('') 单个权限校验
 *  2. auths(['', '']) 满足其中一个返回true
 *  3. authAll(['', '']) 所有满足返回true
 * 
 * 使用：
 *  import {auth, auths, authAll} from '@/utils/authFunction';
 *  if (auth('goods:add')) {
 *      // 有权限 
 *  } else {
 *      // 无权限
 *  }
 */

/**
 * 1. auth('') 单个权限校验
 * @param value 权限标识code
 * @returns true 有权限，false没有权限
 */
export function auth(value: string) : boolean {
    const authStore = useAuthStore();
    return authStore.buttonList.some(btn => btn === value);
}

/**
 * 2. auths(['', '']) 满足其中一个返回true
 * @param values 权限标识code数组
 * @returns true 有权限，false没有权限
 */
export function auths(values: string[]) : boolean {
    const authStore = useAuthStore();
    return authStore.buttonList.some(btn => values.indexOf(btn) != -1);
}

/**
 * 3. authAll(['', '']) 所有满足返回true
 * @param values 权限标识code数组
 * @returns true 有权限，false没有权限
 */
export function authAll(values: string[]) : boolean {
    const authStore = useAuthStore();
    return isContainArr(authStore.buttonList, values);
}