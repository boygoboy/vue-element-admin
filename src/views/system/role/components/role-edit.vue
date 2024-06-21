<template>
  <el-dialog
    :title="`${title}角色`"
    v-model="visible"
    center
    draggable
    :before-close="close"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form
      v-loading="loading"
      ref="formRef"
      :model="formData"
      label-width="85px"
      label-position="right"
      status-icon
      label-suffix=":"
    >
      <el-form-item
        label="角色名称"
        prop="roleName"
        :rules="{
          required: true,
          message: '角色名称为必填项！',
          trigger: 'blur',
        }"
      >
        <el-input
          v-model="formData.roleName"
          placeholder="请输入角色名称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="角色编码"
        prop="roleCode"
        :rules="{
          required: true,
          pattern: /^[a-zA-Z0-9_]{2,30}$/,
          message: '只允许输入2~30位英文/数字/下划线',
          trigger: 'blur',
        }"
      >
        <el-input
          v-model="formData.roleCode"
          placeholder="请输入角色编码"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="角色状态"
        prop="status"
        :rules="{
          required: true,
          message: '角色状态为必选项！',
          trigger: 'change',
        }"
      >
        <el-switch
          v-model="formData.status"
          inline-prompt
          active-text="启"
          inactive-text="停"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注信息"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <el-row justify="center" class="mt10">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";
import { add, update } from "@/api/system/role";
import { notify } from "@/utils/element";

// 定义事件
const emit = defineEmits(["refresh"]);

// 表单ref
const formRef = ref();

// 初始数据
const initData = { status: true };

// 定义状态
const state = reactive({
  visible: false,
  loading: false,
  title: "新增",
  type: "add" as FormType,
  formData: {} as SysRoleType,
});

const { visible, loading, title, formData } = { ...toRefs(state) };

// 导出给父组件调用
defineExpose({
  open,
});

/**
 * 打开窗口
 */
function open(type: FormType, title: string, data = {} as any) {
  state.type = type;
  state.title = title;
  // 合并数据并深度拷贝对象
  state.formData = JSON.parse(JSON.stringify({ ...initData, ...data }));
  state.visible = true;
}

// 关闭窗口
function close() {
  if (state.loading) return;
  //清空表单，清除校验提示
  formRef.value?.resetFields();
  state.visible = false;
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid) => {
    if (!valid) return;
    submitData();
  });
}

// 提交数据
async function submitData() {
  try {
    state.loading = true;
    let res = {};
    delete state.formData.createTime;
    delete state.formData.updateTime;
    if (state.type === "edit") {
      // 修改
      res = await update(state.formData);
    } else {
      // 新增
      res = await add(state.formData);
    }
    state.loading = false; // 防止close关闭不了窗口
    if (res.code !== 200) return;
    notify("操作成功！", { type: "success" });
    // 关闭窗口
    close();
    // 触发事件让父组件刷新列表
    emit("refresh");
  } catch (e) {
  } finally {
    state.loading = false;
  }
}
</script>

<style scoped></style>
