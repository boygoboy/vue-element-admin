import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// 整合ElementPlus
import ElementPlus from 'element-plus';
// @ts-ignore 忽略ts检查
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { useElIcon } from '@/utils/setGlobal';
// 导入全局样式
import '@/styles/index.scss';

// 权限控制，动态路由
import '@/router/permission';

// 自定义指令
import { directive } from '@/directive';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 使用ElementPlus，并且中文
app.use(ElementPlus, {locale: zhCn});
useElIcon(app); // 注册ElementPlus图标

// 注册指令
directive(app);

app.mount('#app');

