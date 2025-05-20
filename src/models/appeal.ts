import { 
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { sequelize } from "../db";
import { AppealStatus } from "../types/appeal";

export class Appeal extends Model<
    InferAttributes<Appeal>, 
    InferCreationAttributes<Appeal>
> {
    public id!: CreationOptional<number>;
    public subject!: string;
    public message!: string;
    public status!: AppealStatus;
    public resolutionText?: string;
    public cancellationReason?: string;
    public createdAt!: CreationOptional<Date>;
    public updatedAt!: CreationOptional<Date>;
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
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(AppealStatus)),
            defaultValue: AppealStatus.NEW,
            allowNull: false
        },
        resolutionText: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cancellationReason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'appeal',
        timestamps: true
    }
)