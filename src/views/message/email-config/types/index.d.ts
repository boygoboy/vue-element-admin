export interface EmailConfig {
    id?: string;
    emailTitle: string;
    emailName: string;
    smtpHost:string;
    smtpPort: number|null;
    enableSsl: boolean;
    userName: string;
    password: string;
    hidePwd?: boolean;
    messageContent?: string;
}