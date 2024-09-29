export interface NoticeConfigQuery{
    name?: string;
    way?: string;
}

export interface NoticeConfig{
    id?:string|number;
    name:string;
    triggerId:string;
    way:string;
    email?:string;
    templateId:string;
    templateName:string;
    cycle:'once'|'cycle';
    interval:number;
    unit:'hour'|'day'|'week'|'month';
    createTime?:string;
    updateTime?:string;
}