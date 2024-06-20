<template>
  <div class="layout-padding">
    <el-form inline :model="query" v-auth="'system:menu:search'">
      <el-form-item label="菜单名称">
        <el-input
          v-model="query.keyword"
          placeholder="请输入菜单名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="queryData()" type="primary">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="action-box">
      <el-button
        v-auth="'system:menu:add'"
        @click="handleAdd()"
        icon="ele-Plus"
        type="primary"
        >新增菜单</el-button
      >
    </div>
    <!-- 树状：data接收的数组元素中要有children属性，必须指定row-key值：数组元素的对象唯一属性名 -->
    <el-table
      v-auth="'system:menu:search'"
      class="w100"
      ref="tableListRef"
      v-loading="loading"
      :data="tableList"
      row-key="id"
      border
      stripe
      @row-click="toggleRow"
    >
      <el-table-column
        prop="meta.title"
        label="菜单名称"
        align="left"
        header-align="center"
      >
        <template #default="{ row }">
          <icon-font
            :iconClass="row.meta?.icon || ''"
            color="#8785b7"
          ></icon-font>
          <span class="ml10">{{ row.meta?.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="路由地址"
        align="left"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="component"
        label="组件路径"
        align="left"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="code"
        label="权限标识"
        align="left"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column prop="type" label="类型" align="center" width="100">
        <template #default="{ row }">
          <!-- '1' == 1  true , '1' === 1 false-->
          <el-tag effect="plain" :type="row.type == 1 ? '' : 'success'">{{
            row.type == 1 ? "菜单" : "按钮"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" width="100" />
      <el-table-column label="操作" align="center" width="240">
        <template #default="{ row }">
          <el-button
            v-auth="'system:child:add'"
            @click.stop="handleAdd(row.id)"
            v-if="row.type != 2"
            icon="ele-Plus"
            type="primary"
            link
            >新增下级</el-button
          >
          <el-button
            v-auth="'system:menu:edit'"
            @click.stop="handleEdit(row)"
            icon="ele-Edit"
            type="warning"
            link
            >修改</el-button
          >
          <el-popconfirm
            @confirm="handleDelete(row.id)"
            width="auto"
            :title="`确定永久删除【${row.meta?.title}】吗？`"
          >
            <template #reference>
              <el-button
                v-auth="'system:menu:delete'"
                @click.stop
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

    <!-- 新增、编辑弹出组件 -->
    <MenuEdit ref="editRef" @refresh="queryData" />
  </div>
</template>

<script setup lang="ts" name="SystemMenu">
import { getList, deleteById } from "@/api/system/menu";
import { ref, reactive, toRefs, onMounted, defineAsyncComponent } from "vue";
import { notify } from "@/utils/element";

const MenuEdit = defineAsyncComponent(
  () => import("@/views/system/menu/components/menu-edit.vue")
);

// 列表ref
const tableListRef = ref();

// 修改ref
const editRef = ref();

const state = reactive({
  loading: false,
  query: {
    keyword: "",
  } as SysMenuQuery,
  tableList: [] as SysMenuType[],
});

const { loading, query, tableList } = { ...toRefs(state) };

onMounted(() => {
  queryData();
});

async function queryData() {
  try {
    state.loading = true;
    state.tableList = [];
    const { data } = await getList(state.query);
    if (data instanceof Array) {
      state.tableList = data;
    }
  } catch (error) {
    debugger;
  } finally {
    state.loading = false;
  }
}

async function reset() {
  state.query.keyword = "";
  await queryData();
}

// 点击行，展开、收起子菜单
function toggleRow(row: SysMenuType) {
  //console.log('toggleRow', row);
  tableListRef.value.toggleRowExpansion(row);
}

// 删除菜单
async function handleDelete(id: string) {
  //console.log('handleDelete', id);
  try {
    state.loading = true;
    await deleteById(id);
    // 提示成功
    notify("删除成功！", { type: "success" });
    // 刷新列表
    queryData();
  } catch (error) {
  } finally {
    state.loading = false;
  }
}

function handleAdd(parentId?: string) {
  // console.log('handleAdd', parentId)
  editRef.value.open("add", "新增", { parentId });
}

function handleEdit(row: SysMenuType) {
  // console.log('handleEdit', row);
  editRef.value.open("edit", "修改", row);
}
</script>

<style scoped>
.action-box {
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
}
</style>
