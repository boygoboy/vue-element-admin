<template>
    <div class="com-box">
        <el-dialog
    :model-value="modelValue"
    :before-close="handleClose"
    title="测试邮件"
    width="30%"
    top="20vh"
  >
    <el-form
      :model="connectForm"
      ref="connectFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
      :rules="connectFormRules"
    >
      <el-form-item label="测试邮箱" prop="email">
        <el-input v-model="connectForm.email" placeholder="请输入收件人邮箱" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          :loading="isLoading"
          icon="Promotion"
          type="primary"
          style="margin-left: 20px"
          @click="sendEmail()"
        >
          发送测试邮件
        </el-button>
      </span>
    </template>
  </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { defineEmits,reactive,ref } from 'vue';
import type {EmailConfig} from '../types'
import {sendEmailApi} from '@/api/message/email-config'
import {notify} from '@/utils/element'
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    emailConfig: EmailConfig;
  }>(),
  {
    modelValue: false,
  }
);
const isLoading=ref(false)
const connectForm=ref({
    email:''
})
const connectFormRef=ref()

const emits = defineEmits(["update:modelValue"]);

const connectFormRules = reactive({
  email: [
    { required: true, message: "请输入收件人邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],

});

function handleClose(){
    emits('update:modelValue',false)
    connectFormRef.value.resetFields()
    connectFormRef.value.email=''
}

function sendEmail(){
   //校验表单
   connectFormRef.value.validate(async(valid:boolean)=>{
     if(valid){
      try{
       isLoading.value=true
          await sendEmailApi({...props.emailConfig,smtpPort:Number(props.emailConfig.smtpPort), ...connectForm.value,enableSsl:props.emailConfig.enableSsl=='1'?true:false})
         notify("发送成功！", { type: "success" });
          handleClose()
      }catch(error){

      }finally{
        isLoading.value=false
      }
     }
   })
}

</script>

<style lang="scss" scoped>

</style>
