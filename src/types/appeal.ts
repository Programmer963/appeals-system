export enum AppealStatus {
    NEW = 'Новое',
    IN_PROGRESS = 'В работе',
    COMPLETED = 'Завершено',
    CANCELLED = 'Отменено'  
}

export interface IAppeal {
    id: number;
    subject: string;
    message: string;
    status: AppealStatus;
    resolutionText?: string;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
