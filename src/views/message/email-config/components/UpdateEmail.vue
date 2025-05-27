<template>
    <div class="com-box">
        <el-dialog
    :model-value="modelValue"
    :before-close="handleClose"
    :title="dialogTitle"
    width="35%"
    top="20vh"
  >
    <el-form
      :model="addForm"
      ref="addFormRef"
      label-width="100px"
      label-position="right"
      style="width: 95%"
      :rules="addFormRules"
    >
      <el-form-item label="邮箱标题" prop="emailTitle">
        <el-input v-model="addForm.emailTitle" placeholder="请输入邮箱标题" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="发件邮箱" prop="emailName">
        <el-input v-model="addForm.emailName" placeholder="请输入发件邮箱" show-word-limit maxlength="50" :disabled="dialogTitle!='创建邮箱配置'" />
      </el-form-item>
      <el-form-item label="SMTP主机" prop="smtpHost">
        <el-input v-model="addForm.smtpHost" maxlength="50" show-word-limit placeholder="请输入SMTP主机" />
      </el-form-item>
      <el-form-item label="SMTP端口" prop="smtpPort">
        <el-input oninput="value=value.replace(/[^0-9]/g,'')" v-model.number="addForm.smtpPort" placeholder="请输入SMTP端口(0~65535)" />
      </el-form-item>
      <el-form-item label="开启SSL" prop="enableSsl">
        <el-switch
          inline-prompt
          active-text="启用"
          inactive-text="关闭"
          v-model="addForm.enableSsl"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          maxlength="50"
          show-word-limit
          v-model="addForm.userName"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          maxlength="50"
          v-model="addForm.password"
          placeholder="请输入密码"
          type="password"
          show-password
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="发信模板" prop="messageContent">
        <el-input
          :rows="5"
          maxlength="255"
          v-model="addForm.messageContent"
          type="textarea"
          placeholder="请输入发信模板"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button  type="info" @click="handleClose">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          style="margin-left: 20px"
          @click="handleSave"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref,reactive,defineEmits,defineExpose} from 'vue';
import type {EmailConfig} from '../types'
import {addEmailConfig,updateEmailConfig} from '@/api/message/email-config'
import {notify} from '@/utils/element'

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    dialogTitle:string;
  }>(),
  {
    modelValue: false,
    dialogTitle:'创建邮箱配置'
  }
);

const isLoading=ref(false)

const emits = defineEmits(["update:modelValue","refreshList"]);

const addForm=ref<EmailConfig>({
    emailTitle:'',
    emailName: '',
    smtpHost:'',
    smtpPort: 465,
    enableSsl:false,
    userName: '',
    password: '',
    messageContent:''
})

const addFormRef=ref()

function handleEditForm(data:EmailConfig){
    addForm.value=data
}

defineExpose({
    handleEditForm
})

const addFormRules=reactive({
    emailTitle: [
        { required: true, message: '请输入邮箱标题', trigger: 'blur' },
    ],
    emailName: [
        { required: true, message: '请输入发件邮箱', trigger: 'blur' },
    ],
    smtpHost: [
        { required: true, message: '请输入SMTP主机', trigger: 'blur' },
    ],
    smtpPort: [
        { required: true, message: '请输入SMTP端口', trigger: 'blur'},       
        {
            pattern: /^(0|[1-9][0-9]{0,4})$/,  // 正则表达式：0 或 1-65535之间的数字
            message: '端口号必须是 0-65535 之间的数字',
            trigger: 'blur'
        }
    ],
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    messageContent: [
        { required: true, message: '请输入发信模板', trigger: 'blur' },
    ],
})

function handleClose(){
    emits("update:modelValue", false);
    emits("refreshList");
    addFormRef.value.resetFields()
    delete addForm.value.id
    addForm.value.emailTitle=''
    addForm.value.emailName=''
    addForm.value.smtpHost=''
    addForm.value.smtpPort=465
    addForm.value.enableSsl='0'
    addForm.value.userName=''
    addForm.value.password=''
    addForm.value.messageContent=''
}

 function handleSave(){
    addFormRef.value.validate(async(valid:boolean)=>{
     if(valid){
        try{
         isLoading.value=true
         if(props.dialogTitle=='创建邮箱配置'){
             const {code}=await addEmailConfig({...addForm.value,enableSsl:addForm.value.enableSsl=='1'?true:false})
            if(code==200){
                notify("创建成功！", { type: "success" });
                handleClose()
            }
         }else{
           const {code}=await updateEmailConfig({...addForm.value,enableSsl:addForm.value.enableSsl=='1'?true:false})
              if(code==200){
                notify("编辑成功！", { type: "success" });
                handleClose() 
              }
         }
         addFormRef.value.resetFields()
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
