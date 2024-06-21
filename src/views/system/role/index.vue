<template>
  <div class="layout-padding">
    <el-form inline :model="query" v-auth="'system:role:search'">
      <el-form-item label="角色名称">
        <el-input
          v-model="query.name"
          maxlength="30"
          placeholder="请输入角色名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery()" type="primary" :loading="loading"
          >查询</el-button
        >
        <el-button @click="reset" :loading="loading">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="action-box">
      <el-button
        v-auth="'system:role:add'"
        @click="handleAdd()"
        icon="ele-Plus"
        type="primary"
        >新增角色</el-button
      >
    </div>

    <el-table
      v-auth="'system:role:search'"
      class="w100"
      ref="tableListRef"
      v-loading="loading"
      :data="tableList"
      border
      stripe
    >
      <el-table-column align="center" type="index" label="序号" width="60" />
      <el-table-column align="center" prop="roleName" label="角色名称" />
      <el-table-column align="center" prop="roleCode" label="角色编码" />
      <el-table-column align="center" prop="status" label="角色状态">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'warning'">{{
            row.status ? "启用" : "停用"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" />
      <el-table-column fixed="right" align="center" label="操作" width="260">
        <template #default="{ row }">
          <el-button
            v-auth="'system:role:menu'"
            @click.stop="handlePermission(row)"
            icon="ele-Check"
            type="primary"
            link
            >分配权限</el-button
          >
          <el-button
            v-auth="'system:role:edit'"
            @click.stop="handleEdit(row)"
            icon="ele-Edit"
            type="warning"
            link
            >修改</el-button
          >
          <el-popconfirm
            @confirm="handleDelete(row.id)"
            width="auto"
            :title="`确定永久删除【${row.roleName}】吗？`"
          >
            <template #reference>
              <el-button
                v-auth="'system:role:delete'"
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

    <!-- 新增、修改组件 -->
    <RoleEdit ref="editRef" @refresh="queryData" />

    <!-- 分配权限 -->
    <Permission ref="permissionRef" />
  </div>
</template>

<script setup lang="ts" name="SystemRole">
import { getPageList, deleteById } from "@/api/system/role";
import { notify } from "@/utils/element";
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  nextTick,
  defineAsyncComponent,
} from "vue";

const RoleEdit = defineAsyncComponent(
  () => import("@/views/system/role/components/role-edit.vue")
);
const Permission = defineAsyncComponent(
  () => import("@/views/system/role/components/permission.vue")
);

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
  query: {
    name: "",
  } as SysRoleQuery,
  tableList: [] as SysRoleType[],
});

const { loading, page, query, tableList } = { ...toRefs(state) };

onMounted(() => {
  queryData();
});

/**
 * 查询列表数据
 */
async function queryData() {
  try {
    state.loading = true;
    // 调用接口
    const { current, size } = state.page;
    const { data } = await getPageList(state.query, current, size);
    //console.log('data', data); // {total: xx, records: []}
    state.tableList = []; // 清空
    nextTick(() => {
      // 总记录数
      state.page.total = data.total;
      // 列表数据
      state.tableList = data.records;
    });
  } catch (error) {
  } finally {
    state.loading = false;
  }
}

// 点击查询
function handleQuery() {
  // 将页码设置为第1页
  state.page.current = 1;
  queryData();
}

async function reset() {
  state.page.current = 1;
  state.page.size = 10;
  state.page.total = 0;
  state.query = { name: "" };
  handleQuery();
}

// 点击删除
async function handleDelete(id: string) {
  // console.log('handleDelete', id);
  try {
    state.loading = true;
    await deleteById(id);
    notify("删除成功！", { type: "success" });
    queryData();
  } catch (error) {
  } finally {
    state.loading = false;
  }
}

// 点击新增
function handleAdd() {
  // console.log('handleAdd');
  editRef.value.open("add", "新增");
}

// 点击修改
function handleEdit(row: SysRoleType) {
  // console.log('handleEdit', row);
  editRef.value.open("edit", "修改", row);
}

// 分配权限
const permissionRef = ref();
function handlePermission(role: SysRoleType) {
  // console.log('handlePermission', role);
  permissionRef.value.open(role);
}
</script>

<style scoped>
.action-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
