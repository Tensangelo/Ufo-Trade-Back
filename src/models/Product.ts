import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

// Models
import Category from "./Category";

class Product extends Model {
    public id!: number;
    public name!: string;
    public description?: string;
    public price?: number;
    public stock!: number;
    public createdAt!: Date;
    public categoryId!: number;
    public status!: boolean;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: "created_at",
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: "id",
            },
            field: "category_id",
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, // Activo por defecto
        },
    },
    {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: false,
    }
);

// Relaciones
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

export default Product;
