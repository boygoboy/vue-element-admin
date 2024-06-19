<script setup lang="ts">

// 定义事件，用于触发父组件的查询方法
const emit = defineEmits(['pageChange']);

// 注意：Props引用 的类型接口不支持外部ts文件导入，必须定义在sfc中。
interface IPage {
    current: number;
    size: number;
    total: number;
}

const props = withDefaults(defineProps<{
    page: IPage;
    small?: boolean; // 是否显示小型页码
    background?: boolean; // 是否显示背景
    layout?: string;
    pagerCount?: number; // 最多展示多少个页码按钮
    always?: boolean; // 0条时是否显示分页
}>(), {
    small: false,
    background: true,
    layout: 'total, sizes, prev, pager, next, jumper',
    pagerCount: 7,
    always: false, 
});


</script>

<template>
    <el-row v-show="page.total || always" justify="end" class="mt20">
        <el-pagination
            v-model:current-page="page.current"
            v-model:page-size="page.size"
            :total="page.total"
            :page-sizes="[10, 20, 50, 100]"
            :small="small"
            :background="background"
            :layout="layout"
            :pager-count="pagerCount"
            @size-change="emit('pageChange')"
            @current-change="emit('pageChange')"
        />
    </el-row>
</template>

<style scoped>

</style>