<script setup lang="ts" name="WangEditor">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive, watch, nextTick  } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import type { IDomEditor } from '@wangeditor/editor';
import { uploadImg } from '@/api/common/media';

interface Props {
    modelValue: string; // html内容，v-model="xx" 1. 先声明modelValue，再emit('update:modelValue', xx), 可以实现双向绑定 v-model="xxx", 
    text?: string;  // text文本内容，v-model:text="xx", 1. 先声明prop名字 text, 再emit('update:text', xxx)
    placeholder?: string; //提示内容
    mode?: 'default' | 'simple'; // 或 'simple'
    disable?: boolean; // 是否禁用编辑
    height?: string;
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: '', 
    text: '', 
    placeholder: '请输入内容',
    mode: 'default',
    disable: false,
    height: '400px',
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'update:text']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const state = reactive({
    editorVal: props.modelValue, // 编辑框内容
    editorConfig: {
        placeholder: props.placeholder,
        MENU_CONF: {} as any,
    }
});

// 声明上传图片成功后，进行回调显示的内容
type InsertFnType = (url: string, alt: string, href: string) => void

// 上传图片
state.editorConfig.MENU_CONF['uploadImage'] = {
    // 自定义上传图片：file 即选中的文件
    async customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
        // 自己实现上传，并得到图片 url alt href
        const form = new FormData();
        form.append('file', file);
        form.append('data', JSON.stringify({sourceType: 'goods_img'}));
        const {data: url} = await uploadImg(form);
        // 最后插入图片
        insertFn(url);
    },
}


// 禁用
watch(() => props.disable, (bool) => {
    nextTick(() => {
        // console.log('bool', bool, editorRef.value)
        const editor = editorRef.value;
        if (editor == null) return;
        bool ? editor.disable() : editor.enable();
    });
}, {immediate: true});

// 记录 editor 实例，重要！
const handleCreated = (editor) => {
    editorRef.value = editor 
}

// 编辑内容区改变内容后触发
function handleChange(editor: IDomEditor) {
    // console.log('handleChange', editor.getHtml(), editor.getText());
    emit('update:modelValue', editor.getHtml());// html内容
    emit('update:text', editor.getText()); // 文本内容
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
})

</script>  

<template>
    <div class="editor-container">
        <Toolbar
            class="editor-toolbar"
            :editor="editorRef"
            :mode="mode"
        />
        <Editor
            class="editor-area"
            :style="{ height }"
            v-model="state.editorVal"
            :defaultConfig="state.editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
            @onChange="handleChange"
        />
    </div>
</template>

<style lang="scss" scoped>
// 暗黑模式样式见 dark.scss
.editor-container {
    .editor-toolbar {
        border: 1px solid var(--el-border-color-light) !important;
        border-radius: 3px 3px 0 0;
    }
    .editor-area {
        border: 1px solid var(--el-border-color-light) !important;
        border-radius: 0 0 3px 3px;
    }
}
</style>