import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';

/**
 * 手动创建一个axios实例，https://axios-http.com/zh/docs/instance 或 https://github.com/axios/axios#creating-an-instance
 */
const request: AxiosInstance = axios.create({
    // 基础url，复制easymock创建的服务接口基础路径，发送每个接口，都会带上这个url
    //baseURL: 'https://mock.mengxuegu.com/mock/64fa8039e70b8004a69ea036/mxg-vue3-elementplus',
    // baseURL: '/dev-api',
    baseURL: import.meta.env.VITE_APP_BASE_API as string,
    timeout: 20000,
});

/**
 * 请求拦截器
 */
request.interceptors.request.use((config) => {
    //console.log('请求拦截器', config);
    // 发送请求前在请求头加上token令牌
    const authStore = useAuthStore();
    const accessToken = authStore.accessToken;
    if (accessToken) {
        // oauth2 请求头带上令牌  Authorization: Bearer xxx
        config.headers.Authorization = accessToken;
    }
    return config;
}, (error) => {
    // 出现异常，则捕获处理（下面是交给调用处的catch)
    return Promise.reject(error);
});

/**
 * 响应拦截器
 * response.data: 
 * {
        "code": 20000,
        "message": "查询成功",
        "data": xxx
    }
 */
request.interceptors.response.use(response => {
    //console.log('响应拦截器', response);
    const { data } = response;
    // 正常响应给调用方式
    if (data.code === 20000) {
        return data;
    }
    // 非正常弹出错误信息
    ElMessage.error(data.message);
    return Promise.reject(response); // 进入调用方catch部分
}, error => {
    const {message, response} = error;
    //console.log('response.error', message, response);
    if (message.indexOf('timeout') != -1) {
        ElMessage.error('网络超时！');
    } else if (message == 'Network Error') {
        ElMessage.error('网络连接错误！');
    } else {
        if (response.data) ElMessage.error(response.statusText);
        else ElMessage.error("接口路径找不到");
    }
    // 出现异常，则捕获处理（下面是交给调用处的catch)
    return Promise.reject(error);
});

// 导出axios实例
export default request; 
