import axios from 'axios';
import type { AxiosInstance ,AxiosRequestConfig} from 'axios';
import {HttpStatus} from '@/utils/types/index';
import { ElMessage } from 'element-plus';
import { useAuthStore,Key } from '@/stores/auth';
import {refreshTokenApi} from '@/api/auth'
import { Session } from '@/utils/storage';

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
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
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
    interface PendingTask {
        config: AxiosRequestConfig
        resolve: Function
      }
    let refreshing = false;
    const queue: PendingTask[] = [];
request.interceptors.response.use(response => {
    //console.log('响应拦截器', response);
    const { data } = response;
    // 正常响应给调用方式
    if (data.code === 200) {
        return data;
    }
    // 非正常弹出错误信息
    ElMessage.error(data.message);
    return Promise.reject(response); // 进入调用方catch部分
}, async (error) => {
    const {response} = error;
    let { config } = response;
    if(refreshing){
     return new Promise((resolve) => {
        queue.push({
            config,
            resolve
        });
    });
    }

    if (response.status === 401 && !config.url.includes('/user/refresh')) {
        refreshing = true;
        const isSuccess= await refreshTokenFunc()
        refreshing = false;
        if(isSuccess) {
          queue.forEach(({config, resolve}) => {
              resolve(axios(config))
          })
          return axios(config);
        } else {
            setTimeout(()=>{

            },3000)
          return Promise.reject(new Error('登录失效，将在3秒后跳转到登录页'));
        }
    } else {
        const {status}=error.response
        if(status==HttpStatus.NOT_FOUND){
            ElMessage.error('请求的资源不存在');
        }
        //网络超时
        if(status==HttpStatus.REQUEST_TIMEOUT){
            ElMessage.error('网络超时');
        }
        if(status==HttpStatus.INTERNAL_SERVER_ERROR){
            ElMessage.error('服务器错误');
        }
        if(status==HttpStatus.BAD_REQUEST){
            ElMessage.error('请求参数错误');
        }
        //   return error.response;
        // 出现异常，则捕获处理（下面是交给调用处的catch)
        return Promise.reject(error.response);
    }
});

async function refreshTokenFunc() {
   try{
    const authStore = useAuthStore();
    const refreshToken = authStore.refreshToken||Session.get(Key.refreshToken);
    const query:RefreshToken = {
        refreshToken
    }
    const res = await refreshTokenApi(query);
    localStorage.setItem('access_token', res.data.access_token || '');
    localStorage.setItem('refresh_token', res.data.refresh_token || '');
    return true
   }catch(error){
     return false
   }
}

// 导出axios实例
export default request; 
