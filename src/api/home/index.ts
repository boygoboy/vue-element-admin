import request from '@/utils/request';

/**
 * 查询营业概况统计数据
 */
export function getStatisticsData() {
    return request({
        url: '/home/statistics',
        method: 'GET',
    });
}

/**
 * 查询分类销售统计数据
 */
export function getCategoryData() {
    return request({
        url: '/home/categoryData',
        method: 'GET',
    });
}

/**
 * 查询分类销售统计数据
 */
export function getLast30DaysSaleData() {
    return request({
        url: '/home/30days/saleData',
        method: 'GET',
    });
}

/**
 * 查询会员消费top10数据
 */
export function getMemberTop10Data() {
    return request({
        url: '/home/member/top10',
        method: 'GET',
    });
}


