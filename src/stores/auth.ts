import { defineStore } from 'pinia';
import { login, logout } from '@/api/auth';
import { Session, Local } from '@/utils/storage';
import type { RouteRecordRaw } from 'vue-router';

export const Key = {
    rememberKey: 'isRemember',
    accessTokenKey: 'accessToken',
    userInfoKey: 'userInfo',
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState<RouteRecordRaw> => {
        return {
            rememberData: Local.get(Key.rememberKey),
            accessToken: Session.get(Key.accessTokenKey),
            userInfo: Local.get(Key.userInfoKey),
            buttonList: [], // 按钮权限
            menuList: [], // 菜单权限
        }
    },

    actions: {
        // 记住密码
        setRememberPwd(data?: LoginData) {
            this.rememberData = data;
            if (data) Local.set(Key.rememberKey, data);
            else Local.remove(Key.rememberKey);
        },
        // 登录操作
        userLogin (loginData: LoginData) {
            return new Promise((resolve, reject) => {
                login(loginData).then((res: any) => {
                    const {data} = res;
                    // 访问令牌
                    const { access_token } = data;
                    this.accessToken = access_token;
                    // 保存到session
                    Session.set(Key.accessTokenKey, access_token);
                    // 正常响应钩子
                    resolve(res);
                }).catch((error: Error) => {
                    reject(error);
                });
            });
        },

        async setUserInfo(data: UserInfo) {
            this.userInfo = data;
            Session.set(Key.userInfoKey, data);
        },

        async setButtonList(data: string[]) {
            this.buttonList = data;
        },

        async setMenuList(data: RouteRecordRaw[]) {
            this.menuList = data;
        },

        // 退出系统
        userLogout () {
            return new Promise((resolve, reject) => {
                logout().then((res) => {
                    // 重置状态
                    this.resetUserState();
                    // 前往登录页：重新加载当前页面，如果当前页面是需要登录的，
                    // 而上面已经将认证状态清除了，再通过路由前置时，没有令牌，则就会跳转到登录页/login
                    // 如果当前页面不需要登录就可以访问，可以继续访问。
                    window.location.reload();
                    resolve(res);
                }).catch((error:Error) => {
                    reject(error);
                });
            });
        },

        // 重置用户状态
        resetUserState() {
            this.accessToken = undefined;
            this.userInfo = undefined;
            this.menuList = [];
            this.buttonList = [];

            // 移除本地保存的数据
            Session.remove(Key.accessTokenKey);
            Session.remove(Key.userInfoKey);
        }
    }
});
