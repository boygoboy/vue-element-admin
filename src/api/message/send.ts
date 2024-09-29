import request from '@/utils/request';
const baseUrl = '/message/send';
import type {NoticeConfigQuery,NoticeConfig} from '@/views/message/send/types';

export function noticeConfigListApi(query:NoticeConfigQuery) {
    return request({
        url: `${baseUrl}/list`,
        method: 'GET',
        params: query
    });
}

export function addNoticeConfigApi(data:NoticeConfig){
    return request({
        url: `${baseUrl}/config`,
        method: 'POST',
        data
    });
}

export function updateNoticeConfigApi(data:NoticeConfig){
    return request({
        url: `${baseUrl}/config`,
        method: 'PUT',
        data
    });
}

export function deleteNoticeConfigApi(id:string){
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE'
    });
}

