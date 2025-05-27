import request from '@/utils/request';
const baseUrl = '/message/template';
import type {TemplateQuery,TemplateConfig} from '@/views/message/templet/types';

export function templateListApi(query:TemplateQuery,current=1,size=10){
    return request({
        url: `${baseUrl}/page`,
        method: 'GET',
        params: {current,size, ...query}
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