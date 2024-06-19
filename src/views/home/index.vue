<!-- <script lang="ts">
    export default {
        name: 'Home',
    }
</script> -->
<!-- name="Home" 借助 vite-plugin-vue-setup-extend-plus 插件并在vite.config.ts中引用 -->
<script setup lang="ts" name="Home">
import { defineAsyncComponent, onMounted, reactive, computed } from 'vue';
import { getCategoryData, getLast30DaysSaleData, getMemberTop10Data } from '@/api/home';
import { useLayoutConfigStore } from '@/stores/layoutConfig';

const StatisticBlock = defineAsyncComponent(() => import('@/views/home/components/statisticBlock.vue'));
const PieChart = defineAsyncComponent(() => import('@/components/echarts/pieChart.vue'));
const LineChart = defineAsyncComponent(() => import('@/components/echarts/lineChart.vue'));
const BarChart = defineAsyncComponent(() => import('@/components/echarts/barChart.vue'));
const GaugeChart = defineAsyncComponent(() => import('@/components/echarts/gaugeChart.vue'));

const layoutConfig = useLayoutConfigStore();
// 图表主题：'dark'暗黑
const theme = computed(() => layoutConfig.isDrak ? 'dark': '');
// 图表背景色
const bgColor = computed(() => layoutConfig.isDrak ? 'transparent': '');

const state = reactive({
    category: {
        loading: false,
        data: [],
    },
    last30Days: {
        loading: false,
        xAxisData: [] as string[],
        data: [] as any[]
    },
    memberTop10: {
        loading: true,
        xAxisData: [] as string[],
        data: [] as number[]
    }
});

onMounted(() => {
    loadCategoryData();
    loadLast30DaysSaleData();
    loadMemberTop10Data();
});

// 分类销售统计查询
async function loadCategoryData() {
    try {
        state.category.loading = true;
        const {data} = await getCategoryData();
        // console.log('data', data)
        state.category.data = data;
    } catch (error) {
    } finally {
        state.category.loading = false;
    }
}

// 查询近30天销售趋势数据
async function loadLast30DaysSaleData() {
    try {
        state.last30Days.loading = true;
        const {data} = await getLast30DaysSaleData();
        const {
                last30Days, orderNumList, rechargeMoneyList,
                returnMoneyList, saleMoneyList
        } = data;
        // x轴数据
        state.last30Days.xAxisData = last30Days;
        // 每种类型的近30天的 y 轴数据
        state.last30Days.data = [
            {typeName: '订单数', list: orderNumList},
            {typeName: '销售额', list: saleMoneyList},
            {typeName: '退款额', list: returnMoneyList},
            {typeName: '充值额', list: rechargeMoneyList}
        ];
        //console.log('loadLast30DaysSaleData', state.last30Days);
    } catch(error) {
    } finally {
        state.last30Days.loading = false;
    }
}

// 查询会员消费top10
async function loadMemberTop10Data() {
    try {
        state.memberTop10.loading = true;
        const {data} = await getMemberTop10Data();
        // console.log('loadMemberTop10Data', data);
        // {name, consumeMoney}
        // 清空：不然刷新数据后，会基于之前的数据追加
        // state.memberTop10.data = []; // 直接赋值[]，在刷新页面后无法渲染出新数据
        // state.memberTop10.xAxisData = [];
        state.memberTop10.xAxisData.length = 0;
        state.memberTop10.data.length = 0;
        data.forEach((item:any) => {
            state.memberTop10.xAxisData.push(item.name);
            state.memberTop10.data.push(item.consumeMoney);
        });
    } catch (error) {
    } finally {
        state.memberTop10.loading = false;
    }
}


</script>

<template>
    <div>
        <StatisticBlock />
        <el-row :gutter="15" >
            <el-col v-loading="state.category.loading" :xs="24" :sm="24" :md="11" :lg="9"  class="mb15">
                <!-- 分类销售统计饼图 -->
                <PieChart 
                    title="分类销售统计" 
                    subtitle="每种商品分类的近30天销售数据"
                    :data="state.category.data"
                    :theme="theme"
                    :bgColor="bgColor"
                />
            </el-col>
            <el-col v-loading="state.last30Days.loading" :xs="24" :sm="24" :md="13" :lg="15"  class="mb15">
                <LineChart 
                 title="近30天销售趋势"
                 :xAxisData="state.last30Days.xAxisData"
                 :data="state.last30Days.data"
                 :theme="theme"
                 :bgColor="bgColor"
                />
            </el-col>
        </el-row>

        <el-row :gutter="15">
            <el-col v-loading="state.memberTop10.loading" :xs="24" :sm="24" :md="13" :lg="15"  class="mb15">
                <!-- 会员消费top10 -->
                <BarChart 
                    title="会员消费Top10"
                    :theme="theme"
                    :bgColor="bgColor"
                    :data="state.memberTop10.data"
                    :xAxisData="state.memberTop10.xAxisData"
                />
            </el-col>
            <el-col :xs="24" :sm="24" :md="11" :lg="9"  class="mb15">
                <!-- 气温仪表盘 °C -->
                <GaugeChart 
                    title="气温仪表盘 °C"
                    :theme="theme"
                    :bgColor="bgColor"
                    :data="38"
                />
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>

</style>