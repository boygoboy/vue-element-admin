<template>
  <el-dialog
    :title="`重置密码【${user.nickName}】`"
    v-model="visible"
    center
    draggable
    :before-close="close"
    width="400px"
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
        label="新密码"
        prop="newPassword"
        :rules="{
          required: true,
          pattern: /^[a-zA-Z0-9]{6,30}$/,
          message: '新密码必须是6~30数字/字母/下划线！',
          trigger: 'blur',
        }"
      >
        <el-input
          v-model.trim="formData.newPassword"
          placeholder="请输入新密码"
          type="password"
          maxlength="30"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="repPassword"
        :rules="{
          required: true,
          validator: passowrdValidator,
          trigger: 'blur',
        }"
      >
        <el-input
          v-model.trim="formData.repPassword"
          show-password
          placeholder="请输入确认密码"
          type="password"
          maxlength="30"
          clearable
        />
      </el-form-item>
    </el-form>
    <el-row justify="center" class="mt10">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { updatePassword } from "@/api/system/user";
import { notify } from "@/utils/element";
import { ref, reactive, toRefs } from "vue";

const formRef = ref();

const state = reactive({
  visible: false,
  loading: false,
  formData: {} as PwdResetForm,
  user: {} as SysUserType,
});

const { visible, loading, formData, user } = { ...toRefs(state) };

// 打开窗口
const open = (user: SysUserType) => {
  state.user = user;
  state.formData.userId = user.id;
  state.visible = true;
};

defineExpose({
  // open方法必须放到上面，下面才可以引用到
  open,
});

// 关闭窗口
const close = () => {
  if (state.loading) return;
  formRef.value?.resetFields();
  state.visible = false;
};

// 校验两次输入的密码是否一致
const passowrdValidator = (rule: any, value: string, callback: Function) => {
  if (!value) return callback(new Error("确认密码为必填项！"));
  if (state.formData.newPassword != value) {
    return callback(new Error("两次输入的密码不一致！"));
  }
  callback();
};

// 提交表单
const submitForm = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      state.loading = true;
      await updatePassword(state.formData);
      state.loading = false;
      notify("密码修改成功！", { type: "success" });
      close();
    } catch (error) {
    } finally {
      state.loading = false;
    }
  });
};
</script>

<style scoped></style>
