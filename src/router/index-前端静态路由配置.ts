import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router';

// 扩展路由表中 meta 对象中的属性
declare module 'vue-router' {
  interface RouteMeta {
    title?: string; // 菜单标题
    icon?: string; // 菜单图标
    linkTo?: string; // 外链地址
    cache?: boolean; // 是否缓存, 将 name放到include属性上 <keep-alive include="xxx"></keep-alive>
    hidden?: boolean; // 是否左侧菜单中显示，true隐藏/false显示
    isBreadcrumd?: boolean; // 是否显示到面包屑中 默认或true会显示，false不显示
  }
}

/**
 * 路由表配置数组（单独抽取：后面扩展后端动态加载）
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'ele-HomeFilled',
          cache: false,
          hidden: false
        }
      },
      {
        path: '/system',
        name: 'System',
        redirect: '/system/menu',
        meta: {
          title: '系统管理',
          icon: 'ele-Setting',
        },
        children: [
          {
            path: '/system/menu',
            name: 'SystemMenu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理',
              icon: 'ele-Menu',
              cache: true,
              hidden: false
            }
          },
          {
            path: '/system/role',
            name: 'SystemRole',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
              title: '角色管理',
              icon: 'ele-IceCream',
              cache: true,
              hidden: false
            }
          },
          {
            path: '/system/user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              icon: 'ele-User',
              cache: true,
              hidden: false
            }
          }
        ]
      },
      {
        path: '/goods',
        name: 'Goods',
        redirect: '/goods/list',
        meta: {
          title: '商品管理',
          icon: 'ele-Goods',
        },
        children: [
          {
            path: '/goods/list',
            name: 'GoodsList',
            component: () => import('@/views/goods/list.vue'),
            meta: {
              title: '商品列表',
              icon: 'ele-GoodsFilled',
              cache: true,
              hidden: false
            }
          },
          {
            path: '/goods/category',
            name: 'GoodsCategory',
            component: () => import('@/views/goods/category.vue'),
            meta: {
              title: '商品分类',
              icon: 'ele-Operation',
              cache: true,
              hidden: false
            }
          },
        ]
      },
      {
        path: '/mengxuegu',
        name: 'Mengxuegu',
        component: () => import('@/views/link/index.vue'),
        meta: {
          title: '梦学谷官网',
          icon: 'ele-Link',
          cache: false,
          hidden: false,
          linkTo: 'https://www.mengxuegu.com' // 外链跳转地址
        }
      },
      {
        path: '/401',
        name: 'NoPermission',
        component: () => import('@/views/error/401.vue'),
        meta: {
          title: '401页面',
          icon: 'ele-Warning',
          cache: true,
          hidden: false,
        }
      },
      { 
        path: '/:path(.*)*', //  404匹配不存在的路由
        name: 'NotFound',
        component: () => import('@/views/error/404.vue'),
        meta: {
          title: '未找到此页面',
          cache: true,
          hidden: true,
        }
      },
    ]
  },
]

/**
 * 全屏显示路由组件，不作用到layout布局主区域渲染出口
 */
const fullscreenRoutes:RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
];

const router = createRouter({
  // 参数获取的是 vite.config.ts 中base 属性值
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: dynamicRoutes,
  routes: [...dynamicRoutes, ...fullscreenRoutes],
});

export default router
