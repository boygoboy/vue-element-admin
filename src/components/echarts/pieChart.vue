<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, reactive, markRaw, onMounted, onBeforeUnmount, onActivated, watch, nextTick } from 'vue';

const props = withDefaults(defineProps<{
    width?: string,
    height?: string,
    theme?: string,
    bgColor?: string,
    title: string,
    subtitle: string,
    data: any[],
}>(), {
    width: '100%',
    height: '380px',
    data: () => [],
});

const chartRef = ref();

const state = reactive({
    chart: null as any, // 图表实例
    nvll: ['', null, undefined], // 用于判断 图表实例是否存在
})

onMounted(() =>{
    // initChart();
    window.addEventListener('resize', echartsResizeFun);
});

//  使用 keep-alive 缓存了组件，每次进入组件时重新绘制大小
onActivated(() => {
    echartsResizeFun();
});

watch(() => [props.data, props.theme], () => {
    nextTick(() => { // 不加模板未初始化完成，chartRef.value是未定义会报错
        initChart();
    });
}, {deep: true, immediate: true});

function initChart() {
    // 实例存在则销毁
    if (state.nvll.indexOf(state.chart) === -1) state.chart.dispose();
    // 获取实例时，记得使用markRaw返回实例本身，不然有些option选项会失效，比如：鼠标放上去显示会失效
    // 参数1：容器ref值，参数2：主题
    state.chart = markRaw(echarts.init(chartRef.value, props.theme));
    const option = {
        backgroundColor: props.bgColor,
        title: {
            text: props.title,
            subtext: props.subtitle,
            left: 'left'
        },
        tooltip: { //鼠标放上去
            trigger: 'item'
        },
        // legend: {
        //     orient: 'vertical',
        //     left: 'right'
        // },
        series: [
            {
            name: '单位：元',
            type: 'pie',
            radius: '60%',
            data: props.data, // 饼图数据
            emphasis: {
                itemStyle: {
                    shadowBlur: 10, // 图形阴影模糊大小
                    shadowOffsetX: 0, // 阴影模糊偏移距离
                    shadowColor: 'rgba(0, 0, 0, 0.5)'  // 阴影颜色
                }
            }
            }
        ]
    };
    state.chart.setOption(option);
}

// 重置echarts图表大小
function echartsResizeFun() {
    state.chart && state.chart.resize();
}

// 组件销毁前触发
onBeforeUnmount(() => {
    window.removeEventListener('resize', echartsResizeFun);
    if (state.chart) {
        state.chart.dispose();
        state.chart = null;
    }
})
</script>

<template>
    <el-card shadow="hover">
        <div ref="chartRef" :style="{width: props.width, height: props.height}"></div>
    </el-card>
</template>

<style scoped>

</style>