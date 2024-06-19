import request from '@/utils/request';

// 商品分类
const baseUrl = '/goods/category';

/**
 * 查询所有分类信息--用于新增/修改商品的分类下拉框
 */
export function getCategoryList() {
    return request ({
        url: `${baseUrl}/list`,
        method: 'GET',
    });
}

/**
 * 条件分页查询商品分类列表
 * @param data GoodsCategoryQuery
 * @returns 
 */
export function getPageList(data: GoodsCategoryQuery) {
    return request({
        url: `${baseUrl}/search`,
        method: 'POST',
        data
    });
}

/**
 * 删除指定id的分类
 * @param id 分类id
 * @returns 
 */
export function deleteById(id: string) {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE',
    });
}

/**
 * 新增分类
 * @param data GoodsCategoryType
 * @returns 
 */
export function add(data: GoodsCategoryType) {
    return request({
        url: `${baseUrl}`,
        method: 'POST',
        data
    });
}


/**
 * 修改商品分类
 * @param data GoodsCategoryType
 * @returns 
 */
export function update(data: GoodsCategoryType) {
    return request({
        url: `${baseUrl}`,
        method: 'PUT',
        data
    });
}