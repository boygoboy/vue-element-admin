import * as echarts from 'echarts';
import { ref, reactive, toRefs, markRaw, onMounted, onBeforeUnmount, onActivated, watch, nextTick } from 'vue';

// withDefaults、defineProps、defineEmits、defineExpose等只允许在SFC（.vue)文件中定义
// 不能外部ts文件中定义。
interface Params {
    props: any;
    option: any; // echarts的图表选项对象
}

function useEcharts(params: Params) {
    const {props, option} = params;
    // 图表ref
    const chartRef = ref();

    // 定义状态
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
        
        // 设置图表选项
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
    });

    return {
        chartRef, // chartRef: chartRef
        ...toRefs(state), // nvll、chart 都是ref, nvll.value, chart.value
        echartsResizeFun, // echartsResizeFun: echartsResizeFun
    }
}

export default useEcharts; // import useEcharts from '@/src/hooks/useEcharts';
export { useEcharts }; // import {useEcharts} from '@/src/hooks/useEcharts';