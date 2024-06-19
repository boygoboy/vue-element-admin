import request from '@/utils/request';

const baseUrl = '/system/user';

/**
 * 分页条件查询用户列表
 * @param query 查询条件
 * @param current 当前页码
 * @param size 每页显示多少数据
 * @returns 
 */
export function getPageList(query: SysUserQuery, current = 1, size = 20) {
    return request({
        url: `${baseUrl}/search`,
        method: 'POST',
        data: {...query, current, size} // 合并对象 {name: xx, current: xxx, size: xx}
    });
}

/**
 * 删除指定用户id的数据
 * @param id 用户id
 */
export function deleteById(id: string) {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE',
    });
}

/**
 * 新增用户
 * @param data SysUserType 新增的数据
 */
export function add(data: SysUserType) {
    return request({
        url: `${baseUrl}`,
        method: 'POST',
        data
    });
}


/**
 * 修改用户
 * @param data SysUserType 修改的数据
 */
export function update(data: SysUserType) {
    return request({
        url: `${baseUrl}`,
        method: 'PUT',
        data
    });
}

/**
 * 校验用户帐号或手机号是否存在
 *  /system/user/exist?username=xxx
 *  /system/user/exist?mobile=xxx
 * @param params 接收{username: xxx} 或者 {mobile: xxxx}
 * @returns 
 */
export function checkExist(params: {username: string} | {mobile: string}) {
    return request({
        url: `${baseUrl}/exist`,
        method: 'GET',
        params //params: params
    })
}

/**
 * 重置用户密码
 */
export function updatePassword(data: PwdResetForm) {
    return request({
        url: `${baseUrl}/password`,
        method: 'PUT',
        data
    })
}