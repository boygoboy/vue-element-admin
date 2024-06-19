import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { initBackEndRoutes } from '@/router/backEnd';

// 白明单：不需要通过身份认证就可以访问的路由
const whiteList = ['/login'];

/**
 * 路由前置，跳转到任意路由都会经过此钩子
 */
router.beforeEach(async (to, form, next) => {
    const authStore = useAuthStore();
    // 获取访问令牌
    const hasToken = authStore.accessToken;
    // 有令牌：再判断是否有用户信息和权限信息
    if (hasToken) {
        // 已登录，而访问的目标是/login，则进入首页
        if (to.path === '/login') {
            return next({path: '/'});
        } else {
            // 无用户信息或无权限信息，则调用接口获取
            if (!authStore.userInfo || authStore.menuList?.length <= 0) {
                // 获取用户信息和权限信息，进行后端控制路由, 
                await initBackEndRoutes();
                // 跳转到目标路由(解决：一直跳转到404页面，找不到目标路径)
                next({path: to.path, query: to.query});
            } else {
                // 有用户信息和权限信息，则跳转到目标路由
                return next();
            }
        }
    } else {
        // 无令牌：跳转到登录页面
        // 白明单，直接放行
        if (whiteList.indexOf(to.path) !== -1) {
            return next();
        } else {
            // 非白明单，未认证跳转登录页
            return next(`/login?redirect=${to.path}`);
        }
    }
});
