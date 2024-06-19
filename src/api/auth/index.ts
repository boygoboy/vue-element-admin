import request from '@/utils/request';
import { Session } from '@/utils/storage';
import { Key,useAuthStore } from '@/stores/auth';

const baseUrl = '/auth';

// 登录接口
export function login (data: LoginData) {
    return request({
        url: `${baseUrl}/token`,
        method: 'POST',
        data
    });
}

// 刷新接口
export function refreshTokenApi (query:RefreshToken):any{
       request({
        url:`${baseUrl}/refreshtoken`,
        method:'get',
        params:query
       })
}

// 退出接口
export function logout () {
    const authStore = useAuthStore();
    return request({
        url: `${baseUrl}/logout`,
        method: 'GET',
        params:{
            refreshToken:authStore.refreshToken||Session.get(Key.refreshToken)
        }
    });
}