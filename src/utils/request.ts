import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpStatus } from '@/utils/types/index';
import { ElMessage } from 'element-plus';
import { useAuthStore, Key } from '@/stores/auth';
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
    const accessToken = authStore.accessToken || Session.get(Key.accessTokenKey);
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
let queue: PendingTask[] = [];
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
    const { response } = error;
    let { config } = response;

    if (refreshing) {
        return new Promise((resolve) => {
            queue.push({
                config,
                resolve
            });
        });
    }

    if (response.status === 401 && !config.url.includes('/user/refresh')) {
        if (!refreshing) {
            refreshing = true;
            refreshTokenFunc().then(isSuccess => {
                refreshing = false;
                if (isSuccess) {
                    // 令牌刷新成功，获取新的accessToken
                    const authStore = useAuthStore();
                    const accessToken = authStore.accessToken || Session.get(Key.accessTokenKey);
                    queue.forEach(({ config, resolve }) => {
                        if (accessToken) {
                            // oauth2 请求头带上令牌  Authorization: Bearer xxx
                            config.headers!.Authorization = `Bearer ${accessToken}`;
                        }
                        axios(config)
                            .then(response => {
                                resolve(response.data);  // 这里解析出data并通过resolve返回
                            })
                            .catch(error => {
                                // 可以在这里处理错误或直接传递错误
                                resolve(Promise.reject(error.response));
                            });
                    });
                    queue = [];  // 清空队列
                }
            }).catch(() => {
                ElMessage.error('登录失效，3s后将自动跳转到登录页');
                setTimeout(() => {
                    const authStore = useAuthStore();
                    authStore.resetUserState();
                    window.location.reload();
                }, 3000);
                queue = [];  // 清空队列
            });
        }
        // 将首次失败的请求也推入队列中等待处理
        return new Promise((resolve) => {
            queue.push({
                config,
                resolve: (retryPromise: any) => resolve(retryPromise),
            });
        });
    } else {
        const { status, data } = error.response
        if (status == HttpStatus.NOT_FOUND) {
            ElMessage.error('请求的资源不存在');
        }
        //网络超时
        if (status == HttpStatus.REQUEST_TIMEOUT) {
            ElMessage.error('网络超时');
        }
        if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
            ElMessage.error('服务器错误');
        }
        if (status == HttpStatus.BAD_REQUEST) {
            ElMessage.error(data.data);
        }
        //   return error.response;
        // 出现异常，则捕获处理（下面是交给调用处的catch)
        return Promise.reject(error.response.data);
    }
});

function refreshTokenFunc() {
    return new Promise((resolve, reject) => {
        const authStore = useAuthStore();
        const refreshToken = authStore.refreshToken || Session.get(Key.refreshToken);
        const accessToken = authStore.accessToken || Session.get(Key.accessTokenKey);
        const query: RefreshToken = {
            refreshToken
        }
        axios({
            url: `${import.meta.env.VITE_APP_BASE_API}/auth/refreshtoken`,
            method: 'get',
            params: query,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((res) => {
            Session.set(Key.accessTokenKey, res.data.data.access_token || '');
            authStore.accessToken = res.data.data.access_token || '';
            resolve(true)
        }).catch(error => {
            reject(false)
        });
    })
}

// 导出axios实例
export default request; 
