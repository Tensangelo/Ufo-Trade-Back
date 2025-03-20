import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Gender extends Model {
    public id!: number;
    public name!: string;
};

Gender.init (
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        }
    },
    {
        sequelize,
        modelName: 'Gender',
        tableName: 'gender',
        timestamps: false,
    }
);

export default Gender;