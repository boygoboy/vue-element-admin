/**
 * 商品管理 相关的数据类型
 */

// 商品条件查询类型
declare interface GoodsQuery{
    keyword: string; // 商品名称、编码、简码
    status: number; // 状态：0下架，1上架
}

// 商品实体类型
declare interface GoodsType {
    id: string;
    code: string;
    name: string;
    imageUrl: string;
    quickCode: string;
    specsName: string; // 规格名称
    unitName: string;
    categoryId: string;
    categoryName: string;
    cost: number; // 成本价
    stockNum: number; 
    price: number; 
    discountPrice: number; 
    score: number; 
    address: string; // 生产地址，省市县
    brand: string; // 品牌
    status: number; // 状态：0下架，1上架
    sort: number;
    remark: string;
    goodsDetail: string; // 一段中文文本(10到30个字)
    createTime: string;
    updateTime: string;
    loading: boolean;//更新状态中
}

// 分类列表查询条件类型
declare interface GoodsCategoryQuery {
    name: string;
}

// 商品分类实体类型
declare interface GoodsCategoryType {
    name: string;
    id: string;
    name: string;
    sort: number;
    status: boolean;
    remark: string;
}