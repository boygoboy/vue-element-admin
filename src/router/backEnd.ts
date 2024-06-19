import { useAuthStore } from "@/stores/auth";
import { getMenuUser } from "@/api/system/menu";
import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import { dynamicRoutes, defaultRoutes } from '@/router';
import router from '@/router';
import { useViewRoutesStore } from "@/stores/viewRoutes";

/**
 * 获取 src/views 目录下的所有 .vue 文件，并排除共 components 目录下的子组件
 */
const modules: Record<string, RouteComponent> = import.meta.glob(['@/views/**/*.vue', '!@/views/**/components/**'])
// console.log('modules', modules);

/**
 * 获取相对路径路由模块：
 *  将 key 本地路由组件路径 `/src/views` 或 `../views` 替换为''
 */
const viewsModules:Record<string, RouteComponent> = 
Object.keys(modules).reduce((prevObj, currKey) => {
    const path = currKey.replace(/\/src\/views|..\/views/, '');
    // console.log('path', path, modules[currKey]);
    // key是变量，必须使用中括号括起来
    return Object.assign(prevObj, {[path]: modules[currKey]});
}, {});
// console.log('viewsModules', viewsModules)


export async function initBackEndRoutes () {
    const authStore = useAuthStore();
    // 1. 判断是否登录过
    if (!authStore.accessToken) return false; 

    // 2. 请求接口获取拥有的权限菜单
    const { data } = await getMenuUser();
    // console.log('data', data);
    const {userInfo, menuList, buttonList} = data;
    authStore.setUserInfo(userInfo);
    authStore.setMenuList(menuList);
    authStore.setButtonList(buttonList);

    // 3. 返回已转换后的动态路由对象数组
    const targetRoutes = dynamicImportComponent(menuList);
    // 将目标路由替换
    dynamicRoutes[0].children = targetRoutes;

    // console.log('dynamicRoutes', dynamicRoutes)
    // 4. 添加动态路径
    addRouteHandle();

    // 5. 将动态路由数组通过pinia保存
    setDynamicRoutes();

    // 6. 将要缓存的路由name收集后保存到pinia
    setCacheRouteNames();
}

/**
 * 将后端响应的路由数组中的 component 字符串属性值，替换为动态导入组件方法 
 * @param dynamicRoutes 
 */
export function dynamicImportComponent(dynamicRoutes: RouteRecordRaw[]) :RouteRecordRaw[]  {
    if (!dynamicRoutes || dynamicRoutes.length <= 0) return [];
    return dynamicRoutes.map((route) => {
        const {component} = route;
        if (component) route.component = viewsModules[`${component}`] || viewsModules[`/${component}`]
        // 递归子路由
        route.children && dynamicImportComponent(route.children);
        return route;
    });
}
/**
 * 动态添加路由对象 router.addRoute(route)
 */
export function addRouteHandle() {
    // 1、将 默认路径 401、404路由与后端返回的权限路由合并，防止不在 layout 布局中渲染，不然会出现401、404页面全屏显示。
    const layoutRouteChildren = [...dynamicRoutes[0].children || [], ...defaultRoutes];
    // console.log('layoutRouteChildren', layoutRouteChildren);
    dynamicRoutes[0].children = layoutRouteChildren;
    // 2、添加动态路由 router.addRoute(route)
    dynamicRoutes.forEach(route => {
        router.addRoute(route);
    });
}

/**
 * 将动态路由数组通过pinia保存
 */
function setDynamicRoutes() {
   const authStore =  useAuthStore();
   authStore.setMenuList(dynamicRoutes[0].children || []);
}

/**
 * 将要缓存的路由name存在到pinia
 */
function setCacheRouteNames() {
    // 存储缓存路由name
    const cacheRouteNames: string[] = [];
    const _getNames = (route: RouteRecordRaw) => {
        // 获取缓存路由name
        if (route.meta?.cache && route.name) cacheRouteNames.push(<string>route.name);
        // 有子路由，则递归获取name值
        if (route.children && route.children.length > 0) {
            route.children.forEach(item => _getNames(item));
        }
    }
    // 调用上面递归方法
    _getNames(dynamicRoutes[0]);
    // console.log('cacheRouteNames', cacheRouteNames);
    // 保存到pinia
    const viewsRoutesStore = useViewRoutesStore();
    viewsRoutesStore.setCacheRouteNames(cacheRouteNames);
}