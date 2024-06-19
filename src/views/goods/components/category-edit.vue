<script setup lang="ts">
import { add, update } from '@/api/goods/category';
import useForm from '@/hooks/useForm';

const emit = defineEmits(['refresh']);

const initData = {status: true, sort: 1};

const {
  formRef,
  visible,
  loading,
  title,
  type,
  formData,
  oldFormData,
  open,
  close,
  submitForm,
} = useForm<GoodsCategoryType>({add, update, initData}, emit);

// 导出父组件调用
defineExpose({
  open,
});
</script>

<template>
  <el-dialog :title="`${title}商品分类`" v-model="visible" 
        center draggable :before-close="close" width="500px" 
        :close-on-click-modal="false" destroy-on-close>
      <div v-loading="loading">
        <el-form ref="formRef" :model="formData" 
          label-width="85px" label-right="right"
          label-suffix=":" status-icon
          >
          <el-form-item label="分类名称" prop="name" :rules="{required: true, message: '分类名称为必填项！', trigger: 'blur'}">
            <el-input v-model="formData.name" maxlength="30" clearable show-word-limit placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="分类状态" prop="status" :rules="{required: true, message: '分类状态为必选项！', trigger: 'change'}">
            <el-switch v-model="formData.status" inline-prompt active-text="启" inactive-text="停"/>
          </el-form-item>
          <el-form-item label="排序号" prop="sort" >
            <el-input-number v-model="formData.sort" :min="1" :max="9999"  placeholder="请输入排序号" class="w100" />
          </el-form-item>
          <el-form-item label="备注" prop="remark" >
            <el-input type="textarea" v-model="formData.remark" maxlength="100" clearable show-word-limit placeholder="请输入备注信息" />
          </el-form-item>
        </el-form>
        <el-row justify="center" class="mt10">
          <el-button @click="close">取 消</el-button>
          <el-button @click="submitForm" type="primary">保 存</el-button>
        </el-row>
      </div>
  </el-dialog>
</template>

<style scoped>
  
</style>