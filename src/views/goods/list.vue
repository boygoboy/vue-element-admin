<script setup lang="ts" name="GoodsList">
import {getPageList, deleteById, updateStatus} from '@/api/goods/list';
import { useTablePage } from '@/hooks/useTablePage';
import { notify } from '@/utils/element';
import { defineAsyncComponent } from 'vue';

const GoodsEdit = defineAsyncComponent(() => import('@/views/goods/components/goods-edit.vue'));

const {
    editRef,
    tableListRef,
    loading, page, query, tableList,
    queryData,
    handleQuery,
    handleDelete,
    handleEdit,
    handleAdd,
} = useTablePage<GoodsType, GoodsQuery>({getPageList, deleteById});


//修改商品状态
async function changeStatus(row: GoodsType) {
    // console.log('changeStatus', row);
    try {
        row.loading = true;
        const {id, status} = row;
        const newStatus = status == 0 ? 1: 0;
        const {code} = await updateStatus({id, status: newStatus});
        if (code != 20000) return false; // 阻止切换
        notify('状态更新成功！', {type: 'success'});
        return true; // 允许切换
    } catch (error) {
        return false; // 阻止切换
    } finally {
        row.loading = false;
    }
}
</script>

<template>
    <div class="layout-padding">
        <el-form v-auth="'goods:search'" inline :model="query" label-suffix=":">
            <el-form-item label="名称/编码">
                <el-input v-model="query.keyword" maxlength="100" placeholder="请输入商品名称/编码/简码" clearable style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="商品状态">
                <el-select v-model="query.status" placeholder="请选择商品状态" clearable>
                    <el-option label="已上架" :value="1"/>
                    <el-option label="已下架" :value="0"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleQuery()" icon="ele-Search" type="primary">查询</el-button>
                <el-button v-auth="'goods:add'" @click="handleAdd()" icon="ele-Plus" type="success">新增商品</el-button>
            </el-form-item>
        </el-form>

        <el-table v-auth="'goods:search'"
            class="w100"
            ref="tableListRef"
            v-loading="loading"
            :data="tableList"
            border
            stripe>
            <el-table-column fixed="left" align="left" header-align="center"  label="商品名称/编码" width="230" show-overflow-tooltip>
                <template #default="{ row }">
                    <div class="flex">
                        <el-avatar shape="square" :size="50" :src="row.imageUrl" icon="ele-Goods" />
                        <div class="ml5">
                            <div>{{ row.name }}</div>
                            <el-link type="primary">{{ row.code }}</el-link>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="specsName" label="商品规格" show-overflow-tooltip/>
            <el-table-column align="center" prop="categoryName" label="分类名称" show-overflow-tooltip/>
            <el-table-column align="center" prop="quickCode" label="快捷码" show-overflow-tooltip/>
            <el-table-column align="center" prop="unitName" label="单位" show-overflow-tooltip/>
            <el-table-column align="center" prop="stockNum" label="库存"/>
            <el-table-column align="center" prop="price" label="销售价"/>
            <el-table-column align="center" label="商品特价" width="110">
                <template #default="{row}">
                    {{ row.discountPrice ? `￥${row.discountPrice}` : '无' }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="cost" label="成本价"/>
            <el-table-column align="center" sortable prop="createTime" label="入库时间" width="105"/>
            <el-table-column align="center" label="商品状态" width="110">
                <template #default="{row}">
                    <el-switch  
                        v-model="row.status"
                        active-text="已上架" 
                        inactive-text="已下架" 
                        :active-value="1"
                        :inactive-value="0"
                        inline-prompt
                        :loading="row.loading"
                        :before-change="() => changeStatus(row)"
                    />
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="160">
                <template #default="{row}">
                    <el-button v-auth="'goods:edit'" @click.stop="handleEdit(row)" icon="ele-Edit" type="warning" link>修改</el-button>
                    <el-popconfirm @confirm="handleDelete(row.id)" width="auto" :title="`确定永久删除【${row.name}】吗？`">
                        <template #reference>
                            <el-button v-auth="'goods:delete'" icon="ele-Delete" type="danger" link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <m-page :page="page" @pageChange="queryData"/>

        <!-- 新增、修改组件 -->
        <GoodsEdit ref="editRef" @refresh="queryData"/>
    </div>
</template>

<style scoped>

</style>