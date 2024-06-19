import { defineStore } from 'pinia';

export const useViewRoutesStore = defineStore('viewRoutes', {
    state: ():ViewRouteState => {
        return {
            cacheRouteNames: [], // 要缓存的路由name
        }
    },

    actions: {
        async setCacheRouteNames(data: string[]) {
            this.cacheRouteNames = data;
        }    
    }
})