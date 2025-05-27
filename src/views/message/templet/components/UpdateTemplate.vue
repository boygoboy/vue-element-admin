<template>
    <el-dialog
        :title="`${title}消息模板`"
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
                label="模板名称"
                prop="templateName"
                :rules="{
                    required: true,
                    message: '模板名称为必填项！',
                    trigger: 'blur',
                }">
                <el-input
                    v-model="formData.templateName"
                    placeholder="请输入模板名称"
                    maxlength="20"
                    show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item
                label="模板类型"
                prop="templateType"
                :rules="{
                    required: true,
                    message: '模板类型为必选项！',
                    trigger: 'change',
                }">
                <el-select
                    style="width: 100%;"
                    v-model="formData.templateType"
                    clearable
                    placeholder="请选择模板类型">
                    <el-option label="邮箱模板" value="Email"></el-option>
                    <el-option label="websocket模板"
                        value="Websocket"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="元数据"
                prop="metadata">
                <el-button type="primary" style="margin-bottom: 20px;" @click="addMeta">添加</el-button>
                <el-table :data="formData.tableData" border
                    style="height: 280px;">
                    <el-table-column prop="value" label="键" align="center" 
                        min-width="50" >
                    <template #default="{row}">
                        <el-input v-model="row.value" class="center-input" placeholder="请输入 键" />
                    </template>
                    </el-table-column>
                    <el-table-column prop="label" label="说明" align="center"
                        min-width="50" >
                        <template #default="{row}">
                            <el-input v-model="row.label" class="center-input" placeholder="请输入说明" />
                        </template>
                    </el-table-column>
                        <el-table-column
                label="操作"
                width="100"
                align="center"
                >
                <template #default="{row,$index}">
                        <el-button
                                icon="ele-Delete"
                                type="danger"
                                @click="deleteMeta($index)"
                                link>删除</el-button>
                </template>
                </el-table-column>
                </el-table>
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
import { addTemplateApi, updateTemplateApi } from "@/api/message/template"
import { useForm } from "@/hooks/useForm"
import { ref, watch, computed } from "vue"
import type { TemplateConfig } from '../types'

const emit = defineEmits(["refresh"])

const initData={
    tableData:[]
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
} = useForm<TemplateConfig & { tableData: any[] }>({ add: addTemplateApi, update: updateTemplateApi, initData}, emit)

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