import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class JobPosition extends Model {
    public id!: number;
    public name!: string;
}

JobPosition.init (
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        }
    },
    {
        sequelize,
        modelName: 'JobPosition',
        tableName: 'job_positions',
        timestamps: false,
    }
);

export default JobPosition;