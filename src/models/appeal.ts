import { DataType, DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export enum AppealStatus {
    NEW = 'Новое',
    IN_PROGRESS = 'В работе',
    COMPLETED = 'Завершено',
    CANCELLED = 'Отменено'  
}

export class Appeal extends Model {
    public id!: number;
    public subject!: string;
    public message!: string;
    public status!: AppealStatus;
    public resolutionText?: string;
    public cancellationReason?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Appeal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(AppealStatus)),
            defaultValue: AppealStatus.NEW
        },
        resolutionText: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Appeal',
        timestamps: true
    }
)