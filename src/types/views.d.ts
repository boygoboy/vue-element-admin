/**
 * 视图相关类型定义
 */

/**
 * 新增或修改的表单类型
 */
declare type FormType = 'edit' | 'add';

/**
 * 分页类型
 */
declare interface PageType {
    current: number; // 当前页码
    size: number; // 每页显示多少条
    total: number; // 总记录数
}