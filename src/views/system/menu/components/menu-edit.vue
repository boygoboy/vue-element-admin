<template>
  <el-drawer
    :title="title + '菜单'"
    v-model="visible"
    :before-close="close"
    direction="rtl"
    size="650px"
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
      <el-form-item label="上级菜单" prop="parentId">
        <!-- 级联选择器 checkStrictly:true 每个项都可以作为单选, emitPath:false只返回选中节点-->
        <el-cascader
          v-model="formData.parentId"
          :options="menuList"
          :props="{
            checkStrictly: true,
            emitPath: false,
            value: 'id',
            label: 'title',
          }"
          clearable
          class="w100"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio v-model="formData.type" :label="1" border>菜单</el-radio>
        <el-radio v-model="formData.type" :label="2" border>按钮</el-radio>
      </el-form-item>
      <el-form-item
        label="菜单名称"
        prop="meta.title"
        :rules="{ required: true, message: '请输入菜单名称', trigger: 'blur' }"
      >
        <el-input
          v-model="formData.meta.title"
          placeholder="请输入菜单名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <template v-if="formData.type == '2'">
        <el-form-item label="权限标识" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入权限标识"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="路由地址" prop="path">
          <el-input
            v-model="formData.path"
            placeholder="请输入路由地址path值"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
          <el-form-item label="组件路径" prop="component">
          <el-input
            v-model="formData.component"
            placeholder="请输入组件路径"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入路由名称相对路径"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="菜单图标" prop="meta.icon">
          <el-input
            v-model="formData.meta.icon"
            placeholder="请输入图标名 ele- 开头"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input
            v-model="formData.redirect"
            placeholder="请输入路由重定向地址redirect值"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否外链" prop="isLink">
              <el-radio-group v-model="formData.isLink" @change="changeIsLink">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16" v-if="formData.isLink">
            <el-form-item label="外链地址" prop="linkTo">
              <el-input
                v-model="formData.meta.linkTo"
                placeholder="请输入外链地址"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="是否隐藏"
              prop="meta.hidden"
              :rules="{
                required: true,
                message: '是否隐藏为必选项',
                trigger: 'change',
              }"
            >
              <el-radio-group v-model="formData.meta.hidden">
                <el-radio :label="false">不隐藏</el-radio>
                <el-radio :label="true">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否缓存"
              prop="meta.cache"
              :rules="{
                required: true,
                message: '是否缓存为必选项',
                trigger: 'change',
              }"
            >
              <el-radio-group v-model="formData.meta.cache">
                <el-radio :label="false">不缓存</el-radio>
                <el-radio :label="true">缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="显示导航" prop="meta.isBreadcrumd">
          <el-radio-group v-model="formData.meta.isBreadcrumd">
            <el-radio :label="false">不显示</el-radio>
            <el-radio :label="true">显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item label="排序号" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="1"
          :max="10000"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注信息"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-row justify="center">
        <el-button @click="close">取消</el-button>
        <el-button :loading="loading" @click="submitForm" type="primary"
          >保存</el-button
        >
      </el-row>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";
import { getMenuSelect, add, update } from "@/api/system/menu";
import { notify } from "@/utils/element";

// 定义自定义事件
const emit = defineEmits(["refresh"]);

// 表单ref
const formRef = ref();

// 初始数据
const initData = {
  type: 1,
  isLink: false,
  sort: 1,
  meta: { hidden: false, cache: true, isBreadcrumd: true },
};

const state = reactive({
  title: "新增", // 新增、编辑
  type: "add" as FormType,
  visible: false,
  loading: false,
  menuList: [], // 存在父菜单下拉选择项
  formData: {
    meta: {},
  } as SysMenuType,
});

const { title, type, visible, loading, menuList, formData } = {
  ...toRefs(state),
};

// 导出提交给父组件使用
defineExpose({
  open, // open: open
});

/**
 * 打开窗口
 * @param data 初始表单数据（新增时parentId传递，编辑时可传递修改的数据）
 */
function open(type: FormType, title: string, data = {} as any) {
  state.type = type;
  state.title = title;
  // 合并初始数据(深度拷贝一份，不然会影响原数据)
  state.formData = JSON.parse(JSON.stringify({ ...initData, ...data }));
  state.visible = true;
  // 查询所有菜单项
  loadMenuSelect();
}

/**
 * 查询所有菜单(不加载按钮)
 */
async function loadMenuSelect() {
  try {
    state.loading = true;
    const { data } = await getMenuSelect();
    state.menuList = data;
  } catch (error) {
  } finally {
    state.loading = false;
  }
}

// 关闭窗口前触发的方法
function close() {
  if (state.loading) return;
  //清空表单，清除校验提示
  formRef.value?.resetFields();
  state.visible = false;
}

// 提交表单校验
function submitForm() {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return;
    // 校验通过，如果是按钮（type='2') 将对应不需要的属性把它清空
    if (state.formData.type == "2") {
      state.formData.path = "";
      state.formData.name = "";
      state.formData.redirect = "";
      state.formData.component = "";
      state.formData.isLink = false;
      state.formData.meta.linkTo = "";
      state.formData.meta.icon = "";
      state.formData.meta.hidden = false;
      state.formData.meta.cache = false;
      state.formData.meta.isBreadcrumd = false;
    }
    // 调用接口提交数据
    submitData();
  });
}

// 调用接口提交数据
async function submitData() {
  try {
    state.loading = true;
    let res: any = {};
    delete state.formData.children
    delete state.formData.createTime
    delete state.formData.updateTime
    if (state.type === "edit") {
      // 修改
      res = await update(state.formData);
    } else {
      // 新增
      const codes=state.formData.path.split('/')
      codes.splice(0,1)
      state.formData.code=codes.join(':')
      res = await add(state.formData);
    }
    state.loading = false;
    if (res.code !== 200) return;
    notify("操作成功！", { type: "success" });
    // 关闭窗口
    close();
    // 触发父组件重新加载数据
    emit("refresh");
  } catch (e) {
  } finally {
    state.loading = false;
  }
}

function changeIsLink(val: boolean) {
  // 不是外链：清空linkTo外链地址
  if (!val) state.formData.meta.linkTo = "";
}
</script>

<style scoped></style>
