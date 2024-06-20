

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {type App } from 'vue';

// 自定义图标组件
import SvgIcon from '@/components/svgIcon/index.vue';
import IconFont from '@/components/IconFont/index.vue';
import Page from '@/components/Global/Page.vue';

/**
 * 全局注册ElementPlus图标
 * <ele-Plus />
 * @param app App
 */
export function useElIcon(app: App) {
  // 全局注册ElementPlus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(`ele-${key}`, component);
  }
  app.component('SvgIcon', SvgIcon); // <svg-icon /> <SvgIcon/>
  app.component('IconFont', IconFont);

  // 注册分页组件 <m-page />
  app.component('MPage', Page);
}
