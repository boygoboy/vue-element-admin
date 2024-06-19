/**
 * pinia 状态类型定义
 */
declare interface LayoutConfigState {
    isCollapse: boolean; // 是否展开菜单
    globalTitle: string; // 网站主标题
    isFullscreen: boolean; // 是否全屏状态：true是
    isDrak: boolean; // 是否暗黑主题：true是
}

// 登录数据类型
declare interface LoginData {
    username: string;
    password: string;
}

// 认证状态
declare interface AuthState<T = any> {
    rememberData?: LoginData; // 记住密码数据
    accessToken?: string; // 访问令牌
    refreshToken?:string;// 刷新token
    userInfo?: UserInfo; // 认证用户信息
    buttonList: string[]; // 按钮权限
    menuList: T[]; // 菜单权限
}


// 认证用户信息类型
declare interface UserInfo {
    nickName: string;
    username: string;
    imageUrl: string;
}

// 视图路由状态
declare interface ViewRouteState {
    cacheRouteNames: string[]; // 要缓存的路由name
}