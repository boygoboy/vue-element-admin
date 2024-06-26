<script setup lang="ts">
import { useForm } from '@/hooks/useForm';
import { add, update, isExist } from '@/api/goods/list';
import { getCategoryList } from '@/api/goods/category';
import { ref, watch, defineAsyncComponent } from 'vue';
import { pinyin } from 'pinyin-pro';
import { isCode } from '@/utils/validate';
import type {UploadRequestOptions} from 'element-plus';
import { uploadImg } from '@/api/common/media';

// 富文本编辑器
const Editor = defineAsyncComponent(() => import('@/components/editor/index.vue'));

const emit = defineEmits(['refresh']);

// 初始化数据
const initData = {status: 1};

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
} = useForm<GoodsType>({initData, add, update}, emit);

// 导出给父组件访问
defineExpose({
    open
});

interface CategoryOptions{
    categoryId: string;
    categoryName: string;
}
// 分类下拉框数据
const categoryOptions = ref<CategoryOptions[]>([]);

watch(() => visible.value, (val) => {
    if (!val) return;
    loadCategoryOptions();
});

async function loadCategoryOptions() {
    try {
        loading.value = true;
        const { data } = await getCategoryList();
        categoryOptions.value = data || [];
    } catch (error) {
    } finally {
        loading.value = false;
    }
}

/**
 * 获取中文的商品名称的首字母拼音
 */
function setQuickCode(name: string) {
    // pattern: 'first'首字母，toneType: 'none'不带声调，separator: ''分隔符默认是一个空格
    formData.value.quickCode = pinyin(name, { pattern: 'first', separator: '', toneType: 'none' }).toUpperCase();
}

/**
 * 校验code商品编码唯一性
 */
async function codeValidator(rule: any, value: string, callback: Function) {
    if (!value) return callback(new Error('商品编码为必填项！'));
    if (!isCode(value))  return callback(new Error('只允许输入3~30位数字、字母和下划线'));
    if (oldFormData.value.code != value) {
       const {data} = await isExist({code: value});
       if (data) return callback(new Error('该商品编码已存在，请更换一个！'));
    }
    callback();
}

// 上传图片  如果报错413: Request Entity Too Large，原因是接口服务器限制最多传1M
async function handleUploadImg(options: UploadRequestOptions) {
    // console.log('handleUploadImg', options);
    try {
        loading.value = true;
        const form = new FormData();
        form.append('file', options.file);
        form.append('data', JSON.stringify({sourceType: 'goods_img'}));
        // 开始上传
        const {data} = await uploadImg(form);
        // 上传成功 , 将上传成功的图片地址赋值回显出来
        formData.value.imageUrl = data;
    } catch(e) {
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <el-drawer :title="title+'商品信息'" v-model="visible" size="800px" :before-close="close" center destroy-on-close>
      <div v-loading="loading">
        <el-scrollbar max-height="calc(100vh - 170px)">
          <el-form class="pr10" ref="formRef" :model="formData" label-width="95px"
                   label-position="right" status-icon label-suffix=":" >
            <el-row>
              <el-col :span="12">
                <el-form-item label="商品名称" prop="name" 
                        :rules="{ required: true, message: '商品名称为必填项！', trigger: 'blur' }" 
                        >
                  <el-input v-model="formData.name" 
                            @change="setQuickCode"
                            maxlength="30" clearable 
                            show-word-limit placeholder="请输入商品名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品分类" prop="categoryId" 
                        :rules="{ required: true, message: '商品分类为必填项！', trigger: 'change' }" >
                  <!--商品分类下拉框-->
                  <el-select v-model="formData.categoryId" clearable filterable placeholder="请选择商品分类" class="w100">
                    <el-option 
                        v-for="(item, index) in categoryOptions" 
                        :key="item.categoryId"
                        :label="item.categoryName"
                        :value="item.categoryId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品编码" prop="code"
                    :rules="{required: true, validator: codeValidator, trigger: 'blur'}"
                >
                  <el-input v-model="formData.code" maxlength="30" 
                        clearable  placeholder="请输入(支持条码枪)">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品规格" prop="specsName" >
                  <el-input v-model="formData.specsName" maxlength="20" 
                            clearable show-word-limit placeholder="请输入规格名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="库存数量" prop="stockNum" 
                            :rules="{ required: true, message: '库存数量为必填项！', trigger: 'blur' }">
                  <el-input-number v-model="formData.stockNum" :min="0"
                              :max="99999999" placeholder="请输入库存数量"  class="w100"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品单位" prop="unitName" >
                  <el-input v-model="formData.unitName" placeholder="请输入商品单位"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售价格" prop="price"
                              :rules="{ required: true, message: '销售价格为必填项！', trigger: 'blur' }">
                  <el-input-number  v-model="formData.price" :precision="2" :step="1"
                                   :min="0" :max="99999999999" placeholder="0.00"  class="w100"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品特价" prop="discountPrice">
                  <el-input-number v-model="formData.discountPrice" :precision="2" :step="1"
                                   :min="0" :max="99999999999" placeholder="0.00"  class="w100"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成本价格" prop="cost" >
                  <el-input-number  v-model="formData.cost" :precision="2" :step="1" :min="0" 
                                   :max="99999999999" placeholder="0.00"  class="w100"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="获得积分" prop="score">
                  <el-input-number v-model="formData.score" :min="0.1" :precision="2" :step="1" 
                                   :max="99999999999" placeholder="请输入可获得积分"  class="w100"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品状态" prop="status" >
                  <el-radio-group v-model="formData.status">
                    <el-radio :label="1" border>上架</el-radio>
                    <el-radio :label="0" border>下架</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品牌名称" prop="brand" >
                  <el-input v-model="formData.brand" maxlength="30" clearable 
                            show-word-limit placeholder="请输入品牌名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品简码" prop="quickCode" >
                  <el-input v-model="formData.quickCode" maxlength="30" clearable 
                            show-word-limit placeholder="请输入，方便快速搜索商品"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品产地" prop="address" >
                  <el-input v-model="formData.address" maxlength="100" clearable 
                            show-word-limit  placeholder="商品产地最多输入100个字" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序号" prop="sort" >
                  <el-input-number v-model="formData.sort" :min="-900000000" 
                                   :max="900000000" placeholder="按数字小到大排序" class="w100"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注信息" prop="remark">
                  <el-input v-model="formData.remark" maxlength="100" clearable 
                            show-word-limit placeholder="备注信息最多输入100个字"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="商品主图" prop="imageUrl">
                <!-- 上传商品主图 -->
                <el-upload
                        class="avatar-uploader"
                        accept="image/png,image/jpg,image/jpeg"
                        action="#"
                        :show-file-list="false"
                        :http-request="handleUploadImg"
                    >
                    <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><ele-Plus /></el-icon>
                    <template #tip>
                        <div class="el-upload__tip">
                            上传的图片大小不能超过 1MB，格式为 png/jpg/jpeg 的文件。
                        </div>
                    </template>
                </el-upload>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="商品详情" prop="goodsDetail">
                <!-- 富文件编辑器 -->
                <Editor v-model="formData.goodsDetail" />
              </el-form-item>
            </el-row>
          </el-form>
        </el-scrollbar>
        <el-row justify="center" class="mt20">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="submitForm()" >保 存</el-button>
        </el-row>
      </div>
    </el-drawer>
  </template>
  
  <style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>
  
  <style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
  </style>