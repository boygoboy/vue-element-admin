<template>
    <div class="layout-padding">
        <el-form inline :model="query" v-auth="'system:user:search'">
            <el-form-item label="模板名称：">
                <el-input
                    v-model="query.templateName"
                    maxlength="100"
                    placeholder="请输入模板名称"
                    clearable
                    style="width: 200px" />
            </el-form-item>
            <el-form-item label="模板类型：">
                <el-select
                    v-model="query.templateType"
                    clearable
                    placeholder="请选择模板类型"
                    style="width: 200px">
                    <el-option label="邮箱模板" value="Email"></el-option>
                    <el-option label="websocket模板"
                        value="Websocket"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleQuery()"
                    type="primary">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-divider />
        <div class="action-box">
            <el-button
                @click="handleAddBefore()"
                icon="ele-Plus"
                type="primary">新增模板</el-button>
        </div>

        <el-table
            class="w100"
            ref="tableListRef"
            v-loading="loading"
            :data="tableList"
            border
            stripe>
            <el-table-column
                fixed="left"
                align="center"
                prop="templateName"
                label="模板名称"
                show-overflow-tooltip />
            <el-table-column
                align="center"
                prop="templateContent"
                label="模板内容"
                show-overflow-tooltip />
            <el-table-column
                align="center"
                prop="templateType"
                label="模板类型"
                show-overflow-tooltip />
            <el-table-column
                align="center"
                prop="metadata"
                label="元数据"
                show-overflow-tooltip>
                <template #default="{ row }">
                    <span v-for="(item, index) in row.metadata"
                        :key="index">
                        <el-tag>{{ item.label }}:{{ item.value }}</el-tag>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" sortable prop="createTime"
                label="创建时间" width="190" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ row.createTime ? formatTime(row.createTime) : "" }}
                </template>
            </el-table-column>
            <el-table-column align="center" sortable prop="updateTime"
                label="更新时间" width="190" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ row.updateTime ? formatTime(row.updateTime) : "" }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作"
                width="260">
                <template #default="{ row }">
                    <el-button
                        @click.stop="handleEdit(row)"
                        icon="ele-Edit"
                        type="warning"
                        link>修改</el-button>
                    <el-popconfirm
                        @confirm="handleDelete(row.id)"
                        width="auto"
                        :title="`确定永久删除【${row.templateName}】吗？`">
                        <template #reference>
                            <el-button
                                icon="ele-Delete"
                                type="danger"
                                link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <m-page :page="page" @pageChange="queryData" />

        <!-- 新增修改组件 -->
        <UpdateTemplate ref="editRef" @refresh="queryData" />
    </div>
</template>

<script setup lang="ts" name="SystemRole">
import { templateListApi, deleteTemplateApi } from "@/api/message/template"
import { useTablePage } from "@/hooks/useTablePage"
import { ref, defineAsyncComponent, onMounted } from "vue"
import { auth, auths, authAll } from "@/utils/authFunction"
import { formatTime } from "@/utils/timeFunction"
import type { TemplateQuery, TemplateConfig } from './types'

const UpdateTemplate = defineAsyncComponent(
    () => import("@/views/message/templet/components/UpdateTemplate.vue")
)

const {
    tableListRef,
    editRef,
    loading,
    page,
    query,
    reset,
    tableList,
    queryData,
    handleQuery,
    handleDelete,
    handleEdit,
    handleAdd,
} = useTablePage<TemplateConfig, TemplateQuery>({ getPageList: templateListApi, deleteById: deleteTemplateApi })

/**
 * 测试：自定义的权限控制方法
 */
function handleAddBefore() {
    handleAdd()
}

onMounted(() => {

});

</script>

<style scoped>
.action-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

:deep(.el-divider--horizontal) {
    margin-top: 7px !important;
    margin-bottom: 20px !important;
}
</style>
