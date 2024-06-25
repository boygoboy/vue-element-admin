<template>
  <el-dialog
    :title="`${title}用户`"
    v-model="visible"
    center
    draggable
    :before-close="close"
    width="700px"
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
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="用户昵称"
            prop="nickName"
            :rules="{
              required: true,
              message: '用户昵称为必填项！',
              trigger: 'blur',
            }"
          >
            <el-input
              v-model="formData.nickName"
              placeholder="请输入用户昵称"
              maxlength="20"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="用户账号"
            prop="username"
            :rules="{
              required: true,
              validator: usernameValidator,
              trigger: 'blur',
            }"
          >
            <el-input
              v-model.trim="formData.username"
              placeholder="请输入用户账号"
              maxlength="20"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="手机号码"
            prop="mobile"
            :rules="{
              required: true,
              validator: mobileValidator,
              trigger: 'blur',
            }"
          >
            <el-input
              v-model.trim="formData.mobile"
              placeholder="请输入手机号码"
              maxlength="20"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="分配角色"
            prop="roleIds"
            :rules="{
              required: true,
              message: '请选择角色',
              trigger: 'change',
            }"
          >
            <!-- 下拉框实现 -->
            <el-select-v2
              multiple
              v-model="formData.roleIds"
              :options="roleOptions"
              placeholder="请选择分配给用户的角色"
              style="width: 100%"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="电子邮箱"
            prop="email"
            :rules="{
              required: true,
              validator: emailValidator,
              trigger: 'blur',
            }"
          >
            <el-input
              v-model.trim="formData.email"
              placeholder="请输入电子邮箱"
              maxlength="50"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="title == '新增'">
          <el-form-item
            label="登录密码"
            prop="password"
            :rules="{
              required: true,
              pattern: /^[a-zA-Z0-9]{6,30}$/,
              message: '密码必须是6~30数字/字母/下划线！',
              trigger: 'blur',
            }"
          >
            <el-input
              v-model.trim="formData.password"
              :disabled="disabled"
              placeholder="请输入6~30位登录密码"
              type="password"
              maxlength="30"
              show-word-limit
              clearable
              show-password
            />
          </el-form-item>
        </el-col>
        <el-col :span="title == '新增' ? 24 : 12">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              placeholder="请输入备注信息"
              maxlength="255"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row justify="center" class="mt10">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { add, update, checkExist } from "@/api/system/user";
import { getRoleList } from "@/api/system/role";
import { useForm } from "@/hooks/useForm";
import { ref, watch, computed } from "vue";
import { isMainAccount, isMobile, isEmail } from "@/utils/validate";

const emit = defineEmits(["refresh"]);

const initData = { accountStatus: false };

const {
  formRef,
  title,
  type,
  visible,
  loading,
  formData,
  oldFormData,
  open,
  close,
  submitForm,
} = useForm<SysUserType>({ add, update, initData }, emit);

defineExpose({
  open,
});

// 修改时禁用
const disabled = computed(() => type.value === "edit");

// 角色选择下拉框数据
const roleOptions = ref([]);

// 监听打开窗口时，进行逻辑处理
watch(
  () => visible.value,
  (val) => {
    if (!val) return;
    loadRoleOptions();
  }
);

// 查询所有角色用于下拉框
async function loadRoleOptions() {
  try {
    loading.value = true;
    const { data } = await getRoleList();
    if (data && data.length > 0) {
      // 转换为下拉框的目标类型数据
      roleOptions.value = data.map((item: any) => ({
        value: item.id,
        label: item.roleName,
      }));
    } else {
      roleOptions.value = [];
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

//校验用户帐号是否存在
async function usernameValidator(rule: any, value: string, callback: Function) {
  if (!value || value == "") {
    return callback(new Error("用户帐号为必填项！"));
  }
  if (!isMainAccount(value)) {
    return callback(new Error("用户帐号必须为6~30位数字/字母/下划线！"));
  }
  if (oldFormData.value.username !== value) {
    const { data } = await checkExist({ username: value });
    // data true存在：不通过，false不存在：则通过
    if (data) return callback(new Error("用户帐号已被注册，请更新一个"));
  }
  // 通过放行
  callback();
}

// 校验手机号
async function mobileValidator(rule: any, value: string, callback: Function) {
  // 可以为空，直接放行
  if (!value || value == "") {
    return callback(new Error("手机号为必填项！"));
  }
  // 校验手机号是否有效格式
  if (!isMobile(value)) {
    return callback(new Error("手机号码格式不正确！"));
  }
  // 请求判断是否唯一性
  if (oldFormData.value.mobile !== value) {
    const { data } = await checkExist({ mobile: value });
    if (data) return callback(new Error("手机号码已存在，请更换一个！"));
  }
  // 通过放行
  callback();
}

async function emailValidator(rule: any, value: string, callback: Function) {
  if (!value || value == "") {
    return callback(new Error("电子邮箱为必填项！"));
  }
  if (!isEmail(value)) {
    return callback(new Error("邮箱格式不正确！"));
  }
  // 请求判断是否唯一性
  if (oldFormData.value.email !== value) {
    const { data } = await checkExist({ email: value });
    if (data) return callback(new Error("邮箱号已存在，请更换一个！"));
  }
  // 通过放行
  callback();
}
</script>

<style scoped></style>
