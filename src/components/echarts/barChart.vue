<script setup lang="ts">
import { useEcharts } from '@/hooks/useEcharts';
import * as echarts from 'echarts';

const props = withDefaults(defineProps<{
    width?: string,
    height?: string,
    theme?: string,
    bgColor?: string,
    title: string,
    subtitle?: string,
    data: number[], // 曲线数据
    xAxisData: string[], // x轴数据
}>(), {
    width: '100%',
    height: '380px',
    data: () => []
});

// 柱状图选项
const option = {
  backgroundColor: props.bgColor,
  title: {
    text: props.title,
    subtext: props.subtitle,
    x: 'left',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
        type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: props.xAxisData
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: props.data,
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }
  ]
};

const { 
    chartRef, 
    chart, nvll, 
    echartsResizeFun
} = useEcharts({props, option}); // {props: props, option: option}
</script>

<template>
    <el-card shadow="hover">
        <div ref="chartRef" :style="{width: props.width, height: props.height}"></div>
    </el-card>
</template>

<style scoped>

</style>