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
                label="模板内容"
                prop="templateContent"
                :rules="{
                    required: true,
                    message: '模板内容为必填项！',
                    trigger: 'blur',
                }">
                    <el-mention
                    v-model="formData.templateContent"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入模板内容"
                    :options="formData.tableData"
                    :prefix="['$']"
                    whole
  >
     <template #label="{ item }">
        <span style="margin-left: 6px">{{ item.value }}</span>
    </template>
</el-mention>
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

const emit = defineEmits(["refresh"])

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
} = useForm<NoticeConfig>({ add: addNoticeConfigApi, update: updateNoticeConfigApi}, emit)

defineExpose({
    open,
})

// 修改时禁用
const disabled = computed(() => type.value === "edit")

// 监听打开窗口时，进行逻辑处理
watch(
    () => visible.value,
    (val) => {
        if (!val) return

    }
);


function addMeta(){
    formData.value.tableData.push({
        value: "",
        label: "",
    })
}

function deleteMeta(index:number){
    formData.value.tableData.splice(index,1)
}

</script>

<style scoped scss>
::v-deep(.center-input .el-input__inner ){
    text-align: center;
}
</style>