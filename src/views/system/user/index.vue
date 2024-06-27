<template>
  <div class="layout-padding">
    <el-form inline :model="query" v-auth="'system:user:search'">
      <el-form-item label="">
        <el-input
          v-model="query.keyword"
          maxlength="100"
          placeholder="请输入用户帐号/昵称/手机号"
          clearable
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery()" type="primary">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="action-box">
      <el-button
        v-auth="'system:user:add'"
        @click="handleAddBefore()"
        icon="ele-Plus"
        type="primary"
        >新增用户</el-button
      >
    </div>

    <el-table
      v-auth="'system:user:search'"
      class="w100"
      ref="tableListRef"
      v-loading="loading"
      :data="tableList"
      border
      stripe
    >
      <el-table-column
        fixed="left"
        align="center"
        prop="nickName"
        label="用户昵称"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="username"
        label="用户帐号"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="mobile"
        label="手机号"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="email"
        label="邮箱"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="帐号启用" width="120">
        <template #default="{ row }">
          <el-switch
            v-auth="'system:user:edit'"
            v-model="row.accountStatus"
            :loading="isLoading"
            inline-prompt
            active-text="启"
            inactive-text="停"
            @change="changeUserStatus(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        sortable
        prop="createTime"
        label="创建时间"
        width="190"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.createTime ? formatTime(row.createTime) : "" }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="260">
        <template #default="{ row }">
          <el-button
            v-auth="'system:user:password'"
            @click.stop="handlePwd(row)"
            icon="ele-Key"
            type="primary"
            link
            >密码重置</el-button
          >
          <el-button
            v-auth="'system:user:edit'"
            @click.stop="handleEdit(row)"
            icon="ele-Edit"
            type="warning"
            link
            >修改</el-button
          >
          <el-popconfirm
            @confirm="handleDelete(row.id)"
            width="auto"
            :title="`确定永久删除【${row.nickName}】吗？`"
          >
            <template #reference>
              <el-button
                :disabled="row.username == 'back_admin'"
                v-auth="'system:user:delete'"
                icon="ele-Delete"
                type="danger"
                link
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <m-page :page="page" @pageChange="queryData" />

    <!-- 新增修改组件 -->
    <UserEdit ref="editRef" @refresh="queryData" />

    <!-- 重置密码组件 -->
    <Password ref="passwordRef" />
  </div>
</template>

<script setup lang="ts" name="SystemRole">
import { getPageList, deleteById, changeStatus } from "@/api/system/user";
import { useTablePage } from "@/hooks/useTablePage";
import { ref, defineAsyncComponent } from "vue";
import { auth, auths, authAll } from "@/utils/authFunction";
import { msg } from "@/utils/element";
import { formatTime } from "@/utils/timeFunction";

const UserEdit = defineAsyncComponent(
  () => import("@/views/system/user/components/user-edit.vue")
);
const Password = defineAsyncComponent(
  () => import("@/views/system/user/components/password.vue")
);
const isLoading = ref(false);

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
} = useTablePage<SysUserType, SysUserQuery>({ getPageList, deleteById });

const passwordRef = ref();
// 重置密码
function handlePwd(row: SysUserType) {
  passwordRef.value.open(row);
}
/**
 * 测试：自定义的权限控制方法
 */
function handleAddBefore() {
  handleAdd();
}

async function changeUserStatus(row: SysUserType) {
  try {
    isLoading.value = true;
    const data: UserStatus = {
      userId: Number(row.id),
      accountStatus: row.accountStatus,
    };
    await changeStatus(data);
    msg("更改用户状态成功", { type: "success" });
  } catch (error) {
    handleQuery();
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.action-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
