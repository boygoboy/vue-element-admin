<script setup lang="ts" name="SystemRole">
import { getPageList, deleteById } from '@/api/system/user';
import { useTablePage } from '@/hooks/useTablePage';
import { ref, defineAsyncComponent } from 'vue';
import { auth, auths, authAll } from '@/utils/authFunction';
import { msg } from '@/utils/element';

const UserEdit = defineAsyncComponent(() => import('@/views/system/user/components/user-edit.vue'));
const Password = defineAsyncComponent(() => import('@/views/system/user/components/password.vue'));


const {
    tableListRef,
    editRef,
    loading, page, query, tableList,
    queryData,
    handleQuery,
    handleDelete,
    handleEdit,
    handleAdd,
} = useTablePage<SysUserType, SysUserQuery>({getPageList, deleteById});

const passwordRef = ref();
// 重置密码
function handlePwd(row: SysUserType) {
    passwordRef.value.open(row);
}
/**
 * 测试：自定义的权限控制方法
 */
function handleAddBefore() {
    if (!auth('system:user:add')) {
        return msg('没有新增权限');
    } 
    msg('有新增权限', {type: 'success'});
    handleAdd();
}
</script>

<template>
    <div class="layout-padding">
        <el-form inline :model="query" v-auth="'system:user:search'">
            <el-form-item label="">
                <el-input v-model="query.keyword" maxlength="100" placeholder="请输入用户帐号/昵称/手机号" clearable style="width: 300px;"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleQuery()" icon="ele-Search" type="primary">查询</el-button>
                <el-button v-auth="'system:user:add'" @click="handleAddBefore()" icon="ele-Plus" type="success">新增用户</el-button>
            </el-form-item>
        </el-form>

        <el-table v-auth="'system:user:search'"
            class="w100"
            ref="tableListRef"
            v-loading="loading"
            :data="tableList"
            border
            stripe>
            <el-table-column fixed="left" align="center" prop="nickName" label="用户昵称" width="120"/>
            <el-table-column align="center" prop="username" label="用户帐号" width="120"/>
            <el-table-column align="center" prop="mobile" label="手机号"/>
            <el-table-column align="center" prop="email" label="邮箱"/>
            <el-table-column align="center" label="帐号锁定">
                <template #default="{ row }">
                    <el-tag :type="row.accountNonLocked ? 'success': 'danger'" effect="dark" >{{ row.accountNonLocked ? '正常': '锁定' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="帐号过期">
                <template #default="{ row }">
                    <el-tag :type="row.accountNonExpired ? 'success': 'danger'" effect="dark" >{{ row.accountNonExpired ? '正常': '过期' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="密码过期">
                <template #default="{ row }">
                    <el-tag :type="row.credentialsNonExpired ? 'success': 'danger'" effect="dark" >{{ row.credentialsNonExpired ? '正常': '过期' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" sortable prop="createTime" label="创建时间" width="105"/>
            <el-table-column fixed="right" align="center" label="操作" width="260">
                <template #default="{row}">
                    <el-button v-auth="'system:user:password'" @click.stop="handlePwd(row)" icon="ele-Key" type="primary" link>密码重置</el-button>
                    <el-button v-auth="'system:user:edit'" @click.stop="handleEdit(row)" icon="ele-Edit" type="warning" link>修改</el-button>
                    <el-popconfirm @confirm="handleDelete(row.id)" width="auto" :title="`确定永久删除【${row.nickName}】吗？`">
                        <template #reference>
                            <el-button v-auth="'system:user:delete'" icon="ele-Delete" type="danger" link>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <m-page :page="page" @pageChange="queryData"/>

        <!-- 新增修改组件 -->
        <UserEdit ref="editRef" @refresh="queryData"/>

        <!-- 重置密码组件 -->
        <Password ref="passwordRef"/>
    </div>
</template>

<style scoped>

</style>