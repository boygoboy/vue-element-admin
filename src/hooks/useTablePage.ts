import { notify } from '@/utils/element';
import { ref, unref, reactive, toRefs, onMounted, nextTick, defineAsyncComponent } from 'vue';
import type { Ref } from 'vue';

interface Params {
    disableMounted?: boolean | Ref; // disableMounted = false | ref(false);
    mustQuery?: any; // 查询条件，使用reactive创建的响应式变量，方便后期更新
    getPageList: Function; // 查询列表的api方法
    deleteById?: Function; // 删除数据的api方法
}

/**
 * 针对分页列表组件实现逻辑
 */
function useTablePage<T = any, Q = any>(params: Params, emit?: Function, props?: any) {
    // 列表ref
    const tableListRef = ref();

    // 编辑ref
    const editRef = ref();

    // 定义状态
    const state = reactive({
        loading: false,
        page: {
            current: 1, // 当前页码
            size: 10, // 每页显示多少条
            total: 0, // 总记录数
        } as PageType,
        query: {} as Q,
        tableList: [] as T[],
    });

    onMounted(() => {
        // 禁用首次加载，方便组件中其他位置触发加载列表
        if (unref(params.disableMounted)) return;
        queryData();
    });

    /**
     * 查询列表数据
     */
    function queryData() {
        // resolve正常处理完成后调用它，reject异常时调用它
        return new Promise((resolve, reject) => {
            state.loading = true;
            // 调用接口
            const { current, size } = state.page;
            debugger
            // 合并必须传递的查询条件
            const query = params.mustQuery ? Object.assign({}, state.query, params.mustQuery) : state.query;
            params.getPageList(query, current, size).then((resp: any) => {
                // state.loading = false;
                const { total, records } = resp.data;
                state.tableList = []; // 清空
                nextTick(() => {
                    // 总记录数
                    state.page.total = total;
                    // 列表数据
                    state.tableList = records;
                });
                // 正常响应
                resolve(resp);
            }).catch((error: Error) => {
                // 异常情况
                reject(error);
            }).finally(() => {
                state.loading = false;
            });
        });
    }

    // 点击查询
    function handleQuery() {
        // 将页码设置为第1页
        state.page.current = 1;
        queryData();
    }

    //重置
    function reset() {
        state.page.current = 1;
        state.page.size = 10;
        state.page.total = 0;
        (state.query as Q) = {} as Q;
        queryData()
    }

    // 点击删除
    async function handleDelete(id: string) {
        try {
            state.loading = true;
            if (params.deleteById) await params.deleteById(id);
            notify('删除成功！', { type: 'success' });
            queryData();
        } catch (error) {
        } finally {
            state.loading = false;
        }
    }

    // 点击新增
    function handleAdd(parentId?: string) {
        editRef.value?.open('add', '新增', parentId);
    }

    // 点击修改
    function handleEdit(row: T) {
        editRef.value?.open('edit', '修改', row);
    }

    return {
        tableListRef,
        editRef,
        ...toRefs(state),
        queryData,
        handleQuery,
        handleDelete,
        handleEdit,
        handleAdd,
        reset
    }

}

export default useTablePage;
export { useTablePage };