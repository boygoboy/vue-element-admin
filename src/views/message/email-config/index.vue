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
                    icon="ele-Plus"
                    type="primary">新建</el-button>
            </div>
        </div>
        <el-divider />
        <div class="email-box">
            <email-item></email-item>
        </div>
    </div>
</template>

<script setup lang="ts" name="EmailConfig">
import { ref, defineAsyncComponent, computed } from "vue"
import { useLayoutConfigStore } from '@/stores/layoutConfig'

const layoutConfig = useLayoutConfigStore()
const EmailItem = defineAsyncComponent(
    () => import("@/system/email/components/EmailItem.vue")
)
const fontColor = computed(() => layoutConfig.isDrak ? '#cfd3dc' : '#333')
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
}
</style>
<style scoped>
:deep(.el-divider--horizontal) {
    margin-top: 20px !important;
    margin-bottom: 20px !important;
}
</style>