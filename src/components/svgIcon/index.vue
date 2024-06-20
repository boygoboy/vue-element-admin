<script setup lang="ts">
import { h, resolveComponent } from "vue";
/**
// h() 是 hyperscript 的简称——意思是“能生成 HTML (超文本标记语言) 的 JavaScript”
// 定义一个渲染函数，参数2为props
const render1 = () => h('div', {class: 'bar', innerHTML: 'hello'});

// 没有props时，参数2可以省略，直接定第3个参数：元素体内容
const render2 = () => h('div', 'mengxuegu');

// <el-icon>ele-Plus</el-icon>
const render3 = () => h('el-icon', {color: 'red', size: 118}, 'ele-Plus')

// 如果以名称注册组件时，可以使用 resolveComponent 函数加载动态组件
// 参数3还可以为h函数，并且建议使用函数返回 () => h(xx,xx,xx)
const render4 = () => h(resolveComponent('el-icon'), 
        {color: 'red', size: 118}, 
        () => h(resolveComponent('ele-Plus')) );
 */

const props = withDefaults(
  defineProps<{
    name?: string; // 图标名称 `ele-` 开头为elementplus图标
    color?: string; // 图标颜色
    size?: number | string; // 图标大小
  }>(),
  {
    name: "",
    size: 18,
  }
);

const render = () => {
  if (props.name?.startsWith("ele-")) {
    //<el-icon color='xxx' size='xxx'><ele-xxx></el-icon>
    return h(
      resolveComponent("el-icon"),
      { color: props.color, size: props.size },
      () => h(resolveComponent(props.name))
    );
  } else {
    return h("i"); // <i></i>
  }
};
</script>

<template>
  <!-- 使用元素方式引用渲染对象 -->
  <render />
</template>

<style scoped></style>
