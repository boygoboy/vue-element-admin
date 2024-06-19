<script setup lang="ts" name="GoodsCategory">
import { getPageList, deleteById } from '@/api/goods/category';
import { useTablePage } from '@/hooks/useTablePage';
import { defineAsyncComponent } from 'vue';

const CategoryEdit = defineAsyncComponent(() => import('@/views/goods/components/category-edit.vue'));

const {
    editRef,
    tableListRef,
    loading, 
    page, 
    query, 
    tableList,
    queryData,
    handleQuery,
    handleDelete,
    handleEdit,
    handleAdd,
} = useTablePage<GoodsCategoryType, GoodsCategoryQuery>({getPageList, deleteById});

</script>

<template>
    <div class="layout-padding">
        <el-form v-auth="'goods:category:search'" inline :model="query" label-suffix=":">
            <el-form-item label="分类名称">
                <el-input v-model="query.name" maxlength="100" placeholder="请输入分类名称" clearable style="width: 200px;"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleQuery()" icon="ele-Search" type="primary">查询</el-button>
                <el-button v-auth="'goods:category:add'" @click="handleAdd()" icon="ele-Plus" type="success">新增分类</el-button>
            </el-form-item>
        </el-form>

        <el-table v-auth="'goods:category:search'"
            class="w100"
            ref="tableListRef"
            v-loading="loading"
            :data="tableList"
            border
            stripe>
            <el-table-column header-align="center" align="left" prop="name" label="分类名称" show-overflow-tooltip/>
            <el-table-column align="center" label="分类状态" width="110">
                <template #default="{row}">
                    <el-tag :type="row.status ? 'success': 'warning'">{{ row.status ? '启用': '停用' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序号"/>
            <el-table-column align="center" prop="remark" label="备注信息" show-overflow-tooltip/>
            <el-table-column fixed="right" align="center" label="操作" width="160">
                <template #default="{row}">
                    <el-button v-auth="'goods:category:edit'" @click.stop="handleEdit(row)" icon="ele-Edit" type="warning" link>修改</el-button>
                    <el-popconfirm @confirm="handleDelete(row.id)" width="auto" :title="`确定永久删除【${row.name}】吗？`">
                        <template #reference>
                            <el-button v-auth="'goods:category:delete'" icon="ele-Delete" type="danger" link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <m-page :page="page" @pageChange="queryData"/>

        <CategoryEdit ref="editRef" @refresh="queryData"/>
    </div>
</template>

<style scoped>

</style>