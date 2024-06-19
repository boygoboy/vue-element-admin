import request from '@/utils/request';

const baseUrl = '/auth';

// 登录接口
export function login (data: LoginData) {
    return request({
        url: `${baseUrl}/token`,
        method: 'POST',
        data
    });
}

// 退出接口
export function logout () {
    return request({
        url: `${baseUrl}/logout`,
        method: 'POST'
    });
}