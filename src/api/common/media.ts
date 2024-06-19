import request from '@/utils/request';

const baseUrl = '/system/media';

/**
 * 上传图片
 * @param data  FormData是js提供的表单对象
 * @returns 
 */
export function uploadImg (data: FormData) {
    return request({
        url: `${baseUrl}/upload/img`,
        method: 'POST',
        data,
    });
}