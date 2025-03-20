import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Category extends Model {
    public id!: number;
    public name!: string;
    public description?: string;
    public createdAt!: Date;
    public status!: boolean;
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
            field: "created_at",
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, // Activo por defecto
        },
    },
    {
        sequelize,
        modelName: "Category",
        tableName: "categories",
        timestamps: false,
    }
);

export default Category;