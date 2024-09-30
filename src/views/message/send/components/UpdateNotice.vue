<template>
    <el-dialog
        :title="`${title}通知配置`"
        v-model="visible"
        center
        draggable
        :before-close="close"
        width="700px"
        :close-on-click-modal="false"
        destroy-on-close>
        <el-form
            v-loading="loading"
            ref="formRef"
            :model="formData"
            label-width="85px"
            label-position="right"
            status-icon
            label-suffix=":">
            <el-form-item
                label="通知名称"
                prop="name"
                :rules="{
                    required: true,
                    message: '通知名称为必填项！',
                    trigger: 'blur',
                }">
                <el-input
                    v-model="formData.name"
                    placeholder="请输入通知名称"
                    maxlength="20"
                    show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item
                label="触发标识"
                prop="triggerId"
                :rules="{
                    required: true,
                    message: '触发标识为必填项！',
                    trigger: 'blur',
                }">
                <el-input
                    v-model="formData.triggerId"
                    placeholder="请输人触发标识"
                    maxlength="20"
                    show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item
                label="通知方式"
                prop="way"
                :rules="{
                    required: true,
                    message: '通知方式为必选项！',
                    trigger: 'change',
                }">
                <el-select
                    style="width: 100%;"
                    v-model="formData.way"
                    clearable
                    placeholder="请选择模板类型">
                    <el-option label="邮箱推送" value="Email"></el-option>
                    <el-option label="websocket推送"
                        value="Websocket"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
            v-if="formData.way==='Email'"
                label="通知邮箱"
                prop="email"
                :rules="{
                    required: true,
                    message: '通知邮箱为必选项！',
                    trigger: 'blur',
                }">
                <el-select v-model="formData.email">
                <el-option v-for="(item,index) in emailOptions" :key="index"
                :label="item.emailName" :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="消息模板"
                prop="templateId"
                :rules="{
                    required: true,
                    message: '消息模板为必选项！',
                    trigger: 'change',
                }">
                <el-select
                    style="width: 100%;"
                    v-model="formData.templateId"
                    clearable
                    placeholder="请选择消息模板">
                   <el-option v-for="(item,index) in templateOptions" 
                    :label="item.templateName"
                    :value="item.id"
                   :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="触发频次"
                prop="cycleCount"
                :rules="{
                    required: true,
                    message: '触发频次为必填项！',
                    trigger: 'blur',
                }">
                <el-input
                    v-model="formData.cycleCount"
                    placeholder="请输入触发频次"
                    maxlength="20"
                    show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item
                label="通知间隔"
                prop="interval"
                :rules="{
                    required: true,
                    message: '通知间隔为必填项！',
                    trigger: 'blur',
                }">
                <div style="display: flex;width: 100%;">
                    <el-input
                    style="width: calc(100% - 120px);margin-right: 15px;"
                    v-model="formData.interval"
                    placeholder="请输入通知间隔"
                    maxlength="20"
                    show-word-limit
                    clearable />
                <el-select v-model="formData.unit" placeholder="请选择周期"
                style="width: 120px;"
                >
                    <el-option label="小时" value="hour"></el-option>
                    <el-option label="天" value="day"></el-option>
                    <el-option label="周" value="week"></el-option>
                    <el-option label="月" value="month"></el-option>
                </el-select>
                </div>
            </el-form-item>
        </el-form>
        <el-row justify="center" class="mt10">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submitForm"
                :loading="loading">保存</el-button>
        </el-row>
    </el-dialog>
</template>

<script setup lang="ts">
import { addNoticeConfigApi, updateNoticeConfigApi } from "@/api/message/send"
import { useForm } from "@/hooks/useForm"
import { ref, watch, computed } from "vue"
import type { NoticeConfig } from '../types'
import type {TemplateConfig} from '../../templet/types'
import type {EmailConfig} from '../../email-config/types'

const emit = defineEmits(["refresh"])

const initData={
    unit:'hour',
}

const {
    formRef,
    title,
    type,
    visible,
    loading,
    formData,
    open,
    close,
    submitForm,
} = useForm<NoticeConfig>({ add: addNoticeConfigApi, update: updateNoticeConfigApi,initData}, emit)

defineExpose({
    open,
})

const templateOptions=ref<TemplateConfig[]>([])
const emailOptions=ref<EmailConfig[]>([])

// 修改时禁用
const disabled = computed(() => type.value === "edit")

// 监听打开窗口时，进行逻辑处理
watch(
    () => visible.value,
    (val) => {
        if (!val) return
      
    }
);



</script>

<style scoped scss>
::v-deep(.center-input .el-input__inner ){
    text-align: center;
}
</style>