import request from '@/utils/request';
const baseUrl = '/message/send';
import type {NoticeConfigQuery,NoticeConfig} from '@/views/message/send/types';

export function noticeConfigListApi(query:NoticeConfigQuery,current=1,size=10){
    return request({
        url: `${baseUrl}/page`,
        method: 'GET',
        params: {current,size,...query}
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

