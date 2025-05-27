/**
 * 系统管理 类型定义
 */
// 菜单查询条件
declare interface SysMenuQuery {
    keyword: string;
}

// 菜单 实体类型
declare interface SysMenuType {
    id: string;
    parentId: string;
    type: '1' | '2'; // '1'菜单，'2'按钮
    path: string;
    name: string;
    code: string;
    redirect: string;
    component: string; // 注意：所在 src/views下的相对路径
    isLink: boolean;// 是否外链
    meta: {
        title: string; // 菜单标题
        icon: string; // 菜单图标
        linkTo: string; // 外链地址
        cache: boolean; // 是否缓存; 将 name放到include属性上 <keep-alive include="xxx"></keep-alive>
        hidden: boolean; // 是否左侧菜单中显示，true隐藏/false显示
        isBreadcrumd: boolean;
    };
    sort: number;
    remark: string;
    createTime?: string;
    updateTime?: string;
    children?: SysMenuType[];
}

// 角色查询条件
declare interface SysRoleQuery {
    name: string; // 角色名称
}

// 角色实体类型
declare interface SysRoleType {
    id: string;
    roleName: string;
    roleCode: string;
    status?: boolean;
    remark: string;
    updateTime?: string;
    createTime?: string;
}


// 用户查询条件
declare interface SysUserQuery {
    keyword: string; // 搜索条件：帐号、昵称、手机号
}

// 用户实体类型
declare interface SysUserType {
    id: string;
    username: string;
    password: string;
    nickName: string;
    mobile: string;
    roleIds: string[];
    email: string;
    password?: string;
    imageUrl: string;
    remark: string;
    accountStatus: boolean;  // 帐号是否过期(true 未过期，false已过期) 生成 true 或 false 概率都是 1/2
    createTime: string;
    updateTime: string;
}

declare interface UserStatus {
    userId: number;
    accountStatus: boolean;
}

declare interface RoleStatus {
    id: number;
    status: boolean;
}

/**
 * 重置密码表单数据类型
 */
declare interface PwdResetForm {
    userId: string;
    newPassword: string; // 新密码
    repPassword: string; // 确认密码
}