<template>
    <div class="layout-padding">
        <div class="title-box">
            <div class="title">
                <icon-font
                    iconClass="youxiang"
                    color="#505bd2"
                    size="5em"></icon-font>
                <div class="sub-title">
                    <span :style="{ color: fontColor }">邮件</span>
                    <span :style="{ color: fontColor }">配置邮件设置</span>
                </div>
            </div>
            <div class="action-btn">
                <el-button
                    @click="addEmail"
                    icon="ele-Plus"
                    type="primary">新建</el-button>
            </div>
        </div>
        <el-divider />
        <div class="email-box">
            <email-item :emailItem="item" v-for="(item,index) in emailList" 
            @updateEmail="handleUpdateEmail"
            @sendEmail="handleSendEmail"
            @refreshList="refreshEmailConfigList"
            :key="index"></email-item>
        </div>
        <update-email v-model="emailDialogVisible" ref="updateEmailRef" :dialogTitle="dialogTitle"
        @refreshList="refreshEmailConfigList"
        ></update-email>
        <email-test :emailConfig="emailConfig!" v-model="emailTestDailogVisible"></email-test>
    </div>
</template>

<script setup lang="ts" name="EmailConfig">
import { ref, computed ,nextTick,onMounted} from "vue"
import { useLayoutConfigStore } from '@/stores/layoutConfig'
import EmailItem from './components/EmailItem.vue'
import UpdateEmail from './components/UpdateEmail.vue'
import EmailTest from './components/EmailTest.vue'
import {getEmailConfigList} from '@/api/message/email-config'
import type {EmailConfig} from './types'

const emailList = ref<EmailConfig[]>([])

const emailDialogVisible = ref(false)
const emailTestDailogVisible=ref(false)

const updateEmailRef=ref()
const emailConfig=ref<EmailConfig>()

const layoutConfig = useLayoutConfigStore()
const fontColor = computed(() => layoutConfig.isDrak ? '#cfd3dc' : '#333')

const dialogTitle=ref('创建邮箱配置')
function addEmail(){
    emailDialogVisible.value = true
    dialogTitle.value='创建邮箱配置'
}

function handleUpdateEmail(data:EmailConfig){
    emailDialogVisible.value = true
    dialogTitle.value='编辑邮箱配置'
    nextTick(()=>{
        updateEmailRef.value?.handleEditForm(data)
    })
}

function handleSendEmail(data:EmailConfig){
    console.log(data)
    emailTestDailogVisible.value=true
    emailConfig.value=data
}

async function getEmailConfigListApi(){
    try{
       const {data} = await getEmailConfigList()
         emailList.value=data
    }catch(error){

    }finally{

    }
}

function refreshEmailConfigList(){
    console.log('refreshEmailConfigList')
    getEmailConfigListApi()
}


onMounted(()=>{
    getEmailConfigListApi()
})
</script>

<style scoped lang="scss">
.layout-padding {
    .title-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            display: flex;
            align-items: center;

            .sub-title {
                display: flex;
                flex-direction: column;
                margin-left: 20px;

                span {
                    font-size: 16px;
                    color: #333;

                    &:first-child {
                        font-weight: bold;
                    }
                }
            }
        }

        .action-btn {}
    }
    .email-box{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        overflow-y: scroll;
    }
}
</style>
<style scoped>
:deep(.el-divider--horizontal) {
    margin-top: 20px !important;
    margin-bottom: 20px !important;
}
</style>