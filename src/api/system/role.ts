import request from '@/utils/request';

const baseUrl = '/system/role';

/**
 * 分页条件查询角色列表
 * @param query 查询条件
 * @param current 当前页码
 * @param size 每页显示多少数据
 * @returns 
 */
export function getPageList(query: SysRoleQuery, current = 1, size = 20) {
    return request({
        url: `${baseUrl}/search`,
        method: 'GET',
        params: { ...query, current, size } // 合并对象 {name: xx, current: xxx, size: xx}
    });
}

/**
 * 删除角色
 * @param id 角色id
 */
export function deleteById(id: string) {
    return request({
        url: `${baseUrl}/${id}`,
        method: 'DELETE',
    });
}

/**
 * 新增角色
 * @param data SysRoleType 新增的数据
 */
export function add(data: SysRoleType) {
    return request({
        url: `${baseUrl}`,
        method: 'POST',
        data
    });
}

/**
 * 修改角色
 * @param data SysRoleType 修改的数据
 */
export function update(data: SysRoleType) {
    return request({
        url: `${baseUrl}`,
        method: 'PUT',
        data
    });
}

export function updateStatus(data: RoleStatus) {
    return request({
        url: `${baseUrl}/status`,
        method: 'PUT',
        data
    });
}


/**
 * 通过角色id查询此角色所拥有的权限菜单dis
 * @param roleId 角色id
 */
export function getMenuIdsByRoleId(roleId: string) {
    return request({
        url: `/system/role/${roleId}/menu/ids`,
        method: 'GET'
    });
}

/**
 * 保存分配的角色权限数据
 * @param roleId 角色id
 * @param menuIds 分配的菜单ids
 */
export function saveRoleMenu(roleId: string, menuIds: string[]) {
    return request({
        url: `/system/role/${roleId}/menu/ids`,
        method: 'POST',
        data: menuIds
    });
}

/**
 * 查询所有角色-用于分配用户角色下拉框
 */
export function getRoleList() {
    return request({
        url: `${baseUrl}/list`,
        method: 'GET',
    });
}