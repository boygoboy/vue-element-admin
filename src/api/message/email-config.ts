import request from '@/utils/request';
const baseUrl = '/message/emailconfig';
import type { EmailConfig } from '@/views/message/email-config/types';

// 根据email的id查询邮箱配置
export function getEmailConfigDetail(id:string) {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'GET'
    });
}

export function sendEmailApi(query:EmailConfig&{email:string}) {
    return request({
        url: `${baseUrl}/emailtest`,
        method: 'GET',
        params: query
    });
}

export function deleteEmailConfig(id:string) {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE'
    });
}

export function addEmailConfig(data:EmailConfig) {
    return request({
        url: `${baseUrl}/config`,
        method: 'POST',
        data
    });
}

export function updateEmailConfig(data:EmailConfig) {
    return request({
        url: `${baseUrl}/config`,
        method: 'PUT',
        data
    });
}

export function getEmailConfigList() {
    return request({
        url: `${baseUrl}/list`,
        method: 'GET',
    });
}