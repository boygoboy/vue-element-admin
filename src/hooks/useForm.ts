import { ref, reactive, toRefs } from 'vue';
import { notify } from '@/utils/element';

interface Params {
    initData?: any; // 初始数据（一般用于新增时的初始数据）
    add?: Function;
    update?: Function;
}

interface BaseFormData {
    createTime?: Date;
    updateTime?: Date;
}

function useForm<T>(params: Params, emit?: any, props?: any) {
    const { initData = {}, add = () => { }, update = () => { } } = params;

    // 表单ref
    const formRef = ref();

    // 定义状态
    const state = reactive({
        visible: false,
        loading: false,
        title: '新增',
        type: 'add' as FormType,
        formData: {} as T & BaseFormData,
        oldFormData: {} as T & BaseFormData,
    });

    /**
     * 打开窗口
     */
    function open(type: FormType, title: string, data = {} as any) {
        state.type = type;
        state.title = title;
        // 合并数据并深度拷贝对象
        state.formData = JSON.parse(JSON.stringify({ ...initData, ...data }));
        // 当修改操作时，做数据校验需要使用
        state.oldFormData = Object.assign({}, state.formData);
        state.visible = true;
    }

    // 关闭窗口
    function close() {
        if (state.loading) return;
        //清空表单，清除校验提示
        formRef.value?.resetFields();
        state.visible = false;
    }

    // 提交表单
    function submitForm() {
        formRef.value?.validate((valid: boolean) => {
            if (!valid) return;
            submitData();
        });
    }

    // 提交数据
    async function submitData() {
        try {
            state.loading = true;
            let res;
            delete state.formData.createTime;
            delete state.formData.updateTime;
            if (state.type === 'edit') {
                // 修改
                res = await update(state.formData);
            } else {
                // 新增
                res = await add(state.formData);
            }
            state.loading = false;// 防止close关闭不了窗口
            if (res.code !== 200) return;
            notify('操作成功！', { type: 'success' });
            // 关闭窗口
            close();
            // 触发事件让父组件刷新列表
            emit('refresh');
        } catch (e) {
        } finally {
            state.loading = false;
        }
    }

    return {
        formRef,
        ...toRefs(state),
        open,
        close,
        submitForm,
    }
}

export default useForm;
export { useForm };