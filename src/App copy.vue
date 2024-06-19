<script setup lang="ts">
//import SvgIcon from '@/components/svgIcon/index.vue';
import { test1, test2, getList } from '@/api/test';
import { onMounted, ref } from 'vue';

// 调用方法发送请求
test1();

// test2()返回promise
test2().then(response => {
  console.log('test2.response', response)
}).catch(error => {
  console.log('error', error)
});

const list = ref<any[]>([]);

onMounted(() => {
  loadData();
  loadData2();
});

function loadData() {
  getList().then(response => {
    console.log('loadData.response', response)
    list.value = response.data;
  }).catch(error => {
    console.log('loadData.error')
  })
}

async function loadData2() {
  //const response = await getList();
  // console.log('loadData2', response.data, response.code, response.message)
  try {
    const {data, code, message}  = await getList();
    console.log('loadData22',data, code, message)
  } catch (error) {
    console.log('loadData22.error', error)
  }
}
// `development`开发环境，production 生产环境
console.log('当前是什么环境', import.meta.env.MODE);

console.log('获取自定义环境配置', 
  import.meta.env.VITE_APP_BASE_API, 
  import.meta.env.VITE_APP_SERVICE_URL 
  )
</script>

<template>
  <div>
    {{ list }}
  </div>
</template>

<style scoped>

</style>
