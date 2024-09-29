export interface TemplateQuery{
    templateName?: string;
    templateType?: string;
}

export interface TemplateConfig{
    id?:string|number;
    templateName:string;
    templateType:string;
    templateContent:string;
    metadata:Array<{
        label:string;
        value:string;
    }>;
    createTime?:string;
    updateTime?:string;
}