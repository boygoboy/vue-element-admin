<script setup lang="ts">
import { useEcharts } from '@/hooks/useEcharts';
import { reactive, computed } from 'vue';
interface Series{
    typeName: string;
    list: number[];
}

const props = withDefaults(defineProps<{
    width?: string,
    height?: string,
    theme?: string,
    bgColor?: string,
    title: string,
    subtitle?: string,
    data: Series[], // 曲线数据
    xAxisData: string[], // x轴数据
}>(), {
    width: '100%',
    height: '380px',
    data: () => []
});

const legendData = computed(() => props.data.map(item => item.typeName));
const series = computed(() => props.data.map(item => ({
    name: item.typeName,
    data: item.list,
    type: 'line',
    // stack: 'Total', 加了会出现线和值对应不上情况：用了数据堆叠，当两条线相近时，后面的值会在前面一系列的值上面叠加
})));

// 折线图选项
const option = reactive({
    backgroundColor: props.bgColor,
    title: {
        text: props.title,
        subtext: props.subtitle,
        left: 'left'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: legendData,
        right: '50px',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: { // 下载图片
                title: '下载为图片'
            } 
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: computed(() => props.xAxisData)
    },
  yAxis: {
    type: 'value'
  },
  series: series,
});

const {chartRef} = useEcharts({props, option});

</script>

<template>
    <el-card shadow="hover">
        <div ref="chartRef" :style="{width: props.width, height: props.height}"></div>
    </el-card>
</template>

<style scoped>

</style>