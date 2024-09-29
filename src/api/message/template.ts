import request from '@/utils/request';
const baseUrl = '/message/template';
import type {TemplateQuery,TemplateConfig} from '@/views/message/templet/types';

export function templateListApi(query:TemplateQuery) {
    return request({
        url: `${baseUrl}/list`,
        method: 'GET',
        params: query
    });
}

export function addTemplateApi(data:TemplateConfig){
    return request({
        url: `${baseUrl}/config`,
        method: 'POST',
        data
    });
}

export function updateTemplateApi(data:TemplateConfig){
    return request({
        url: `${baseUrl}/config`,
        method: 'PUT',
        data
    });
}

export function deleteTemplateApi(id:string){
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE'
    });
}