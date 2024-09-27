<template>
    <div class="com-box">
        <el-card
      shadow="hover"
      class="card"
      v-for="(item, index) in emailItem"
      :key="index"
    >
      <template #header>
        <div class="header-title">
          <span>{{ emailItem.emailTitle }}</span>
        </div>
      </template>
      <div class="content">
        <div class="row-text">
          <span>发件邮箱:</span>
          <span>{{ emailItem.emailName }}</span>
        </div>
        <div class="row-text">
          <span>SMTP主机:</span>
          <span>{{ emailItem.smtpHost }}</span>
        </div>
        <div class="row-text">
          <span>SMTP端口:</span>
          <span>{{ emailItem.smtpPort }}</span>
        </div>
        <div class="row-text">
          <span>开启SSL:</span>
          <span>{{ emailItem.enableSsl ? "是" : "否" }}</span>
        </div>
        <div class="row-text">
          <span>用户名:</span>
          <span>{{ emailItem.userName }}</span>
        </div>
        <div class="row-text">
          <span>SMTP密码:</span>
          <span style="margin-right: 5px">{{
            emailItem.hidePwd ? emailItem.password : "******"
          }}</span>
          <svg-icon
            iconName="icon-yanjing"
            className="eye-icon"
            v-if="emailItem.hidePwd"
            @click="emailItem.hidePwd = false"
          ></svg-icon>
          <svg-icon
            iconName="icon-eyes-closed"
            className="eye-icon"
            v-else
            @click="emailItem.hidePwd = true"
          ></svg-icon>
        </div>
        <div class="action-btn">
          <el-button type="primary" link 
            >smtp配置</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="success" link 
            >测试邮件</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="danger" link 
            >删除</el-button
          >
        </div>
      </div>
    </el-card>
    </div>
</template>

<script setup lang="ts">
import type {EmailConfig} from '../types'
const props = withDefaults(defineProps<{
    emailItem:EmailConfig
}>(), {
    emailItem:()=>({
    id:'',
    emailTitle:'',
    emailName: '',
    smtpHost:'',
    smtpPort: null,
    enableSsl:false,
    userName: '',
    password: '',
    hidePwd: true,
    })
});

</script>

<style lang="scss" scoped>
  .card {
    width: 30%;
    margin-right: 20px;
    margin-bottom: 20px;
    min-width: 300px;
    .header-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      font-weight: 500;
      font-size: 16px;
    }
    &::v-deep .el-card__header {
      padding: 12px 12px;
      background: #1c0054;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      .row-text {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 15px;
        opacity: 0.9;
        font-size: 14px;
        span:nth-child(1) {
          width: 80px;
          display: inline-block;
          text-align: right;
          margin-right: 10px;
          white-space: nowrap;
        }
      }
      .action-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
