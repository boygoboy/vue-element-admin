import request from '@/utils/request';

const baseUrl = '/goods';

/**
 * 分页条件查询商品列表
 * @param query 查询条件
 * @param current 当前页码
 * @param size 每页显示多少数据
 * @returns 
 */
export function getPageList(query: GoodsQuery, current = 1, size = 20) {
    return request({
        url: `${baseUrl}/search`,
        method: 'POST',
        data: {...query, current, size} // 合并对象 {name: xx, current: xxx, size: xx}
    });
}

/**
 * 删除指定商品id的数据
 * @param id 商品id
 */
export function deleteById(id: string) {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE',
    });
}

/**
 * 更新商品状态
 * @param data 
 */
export function updateStatus(data: {id: string, status: number}) {
    return request({
        url: `${baseUrl}/status`,
        method: 'PUT',
        data
    });
}

/**
 * 新增商品
 * @param data GoodsType
 * @returns 
 */
export function add(data: GoodsType) {
    return request({
        url: `${baseUrl}`,
        method: 'POST',
        data
    });
}


/**
 * 修改商品
 * @param data GoodsType
 * @returns 
 */
export function update(data: GoodsType) {
    return request({
        url: `${baseUrl}`,
        method: 'PUT',
        data
    });
}

/**
 * 查询商品编码是否已存在
 * @param params {code: xx}
 * @returns 
 */
export function isExist(params: {code: string}) {
    return request({
        url: `${baseUrl}/exist`,
        method: 'GET',
        params // params: params   ?code=xxx
    });
}