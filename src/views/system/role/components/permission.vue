<script setup lang="ts">
import { getList } from '@/api/system/menu';
import { getMenuIdsByRoleId, saveRoleMenu } from '@/api/system/role';
import { ref, reactive, toRefs } from 'vue';
import { notify } from '@/utils/element';

const treeRef = ref();

const state = reactive({
    visible: false,
    loading: false,
    role: {} as SysRoleType, // 点击的那个角色对象
    menuList: [] as SysMenuType[],
    menuIds: [] as string[], // 角色拥有的ids
    checked: false, // 是否已全选
    expandAll: false, // 是否已展开
    submitting: false, // 提交中
});

const {visible, loading, role, menuList, menuIds, checked, expandAll, submitting} = {...toRefs(state)};

// 导出给父组件调用
defineExpose({
    open
});

/**
 * 打开窗口
 */
async function open(role: SysRoleType) {
    state.role = role;
    state.visible = true;
    await loadMenuList();
    // 查询角色拥有的菜单ids
    await loadRoleMenuIds();
    await checkOldMenuNode();
}

/**
 * 关闭窗口
 */
function close() {
    if (state.submitting) return;
    state.menuIds = [];
    state.menuList = [];
    state.checked = false;
    state.expandAll = false;
    state.visible = false;
}

/**
 * 查询所有菜单项
 */
async function loadMenuList() {
    try {
        state.loading = true;
        const {data} = await getList();
        state.menuList = data;
    } catch (error) {
    } finally {
        state.loading = false;
    }
}

/**
 * 查询角色原有权限菜单ids
 */
async function loadRoleMenuIds() {
    try {
        state.loading = true;
        const {data} = await getMenuIdsByRoleId(state.role.id);
        state.menuIds = data;
    } catch (error) {
    } finally {
        state.loading = false;
    }
}

/**
 * 进行回显角色原的的权限菜单
 */
function checkOldMenuNode() {
    const { menuIds } = state;
    menuIds.forEach(id => {
        // 获取节点对象
        const node = treeRef.value.getNode(id);
        // console.log('isLeft', id, node.isLeaf)
        // 根据节点对象，判断是否为子节点，是子节点则勾选，不是则不勾选 
        if (node && node.isLeaf) treeRef.value.setChecked(id, true);
    });
}

/**
 * 实现全选、不选
 */
function handleCheckAll() {
    state.checked = !state.checked;
    // 全选
    if (state.checked) treeRef.value.setCheckedNodes(state.menuList);
    // 取消全选
    else treeRef.value.setCheckedNodes([]);
}

/**
 * 展开、收起
 */
function handleExpand() {
    state.expandAll = !state.expandAll;
    changeTreeNodeStatus(treeRef.value.store.root);
}

/**
 * 递归所有节点将它的子节点展开
 */
function changeTreeNodeStatus(node: Node) {
    // console.log('node', node);
    node.expanded = state.expandAll;
    for (let i=0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = state.expandAll;
        // 查询当前节点是否还有子节点
        if (node.childNodes[i].childNodes.length > 0) {
            // 递归此节点下的N级子节点
            changeTreeNodeStatus(node.childNodes[i]);
        }
    }
}

/**
 * 提交权限数据
 */
async function submitForm() {
    try {
        state.submitting = true;
        // 收集选中的菜单ids
        const checkedMenuIds = treeRef.value.getCheckedKeys();
        // console.log('checkedMenuIds', checkedMenuIds);
        // 收集半选中(父节点）的菜单id
        const parentIds = treeRef.value.getHalfCheckedKeys();
        // console.log('parentIds', parentIds);
        // 合并所有上面获取的菜单ids
        const menuIds = parentIds.concat(checkedMenuIds);
        await saveRoleMenu(state.role.id, menuIds);
        notify('分配权限成功!', {type: 'success'});
        state.submitting = false; // 防止关闭不了窗口
        // 关闭弹窗
        close();
    } catch (error) {
    } finally {
        state.submitting = false;
    }
}

</script>

<template>
    <el-drawer :title="`分配【${role.roleName}】权限`" v-model="visible" :before-close="close" direction="rtl" size="400px" >
        <div v-loading="loading">
            <el-tree 
                ref="treeRef"
                :data="menuList" 
                node-key="id"
                show-checkbox
                highlight-current
                :props="{children: 'children'}"
                :default-expand-all="expandAll"
            >
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                        <!-- 一、二级菜单类型显示自定义图标 -->
                        <SvgIcon v-if="[1, 2].includes(node.level)" :name="data.meta.icon"/>
                        <!-- 三级菜单显示`菜单`或`按钮`图标 -->
                        <el-icon v-else>
                            <ele-Menu v-if="data.type == 1" />
                            <ele-SwitchButton v-else-if="data.type == 2"/>
                        </el-icon>
                        <span class="ml10">{{ data.meta.title }}</span>
                    </span>
                </template>
            </el-tree>
        </div>
        <template #footer>
            <el-button :loading="submitting" @click="submitForm" type="primary">提交</el-button>
            <el-button @click="handleCheckAll">全选/不选</el-button>
            <el-button @click="handleExpand">展开/收起</el-button>
            <el-button @click="close">取消</el-button>
        </template>
    </el-drawer>
</template>

<style lang="scss" scoped>
.custom-tree-node {
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-left: 10px;
}
</style>