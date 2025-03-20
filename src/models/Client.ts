import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";

// Models
import JobPosition from "./JobPosition";
import Gender from "./Gender";

class Client extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public phone?: string;
    public address?: string;
    public birthDate?: Date;
    public rolId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Client.init(
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
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        birthDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "birth_date",
        },
        rolId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5, // Usuario base por defecto
            references: {
                model: JobPosition,
                key: "id",
            },
            field: "rol_id",
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("NOW()"),
            allowNull: false,
            field: "created_at",
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("NOW()"),
            allowNull: false,
            field: "updated_at",
        },
        genderId: {
            type: DataTypes.INTEGER,
            references: {
                model: Gender,
                key: 'id',
            },
            allowNull: false,
            field: "gender_id",
        },
    },
    {
        sequelize,
        modelName: "Client",
        tableName: "clients",
        timestamps: false,
    }
);

// Relación con JobPosition
Client.belongsTo(JobPosition, { foreignKey: "rolId" });
JobPosition.hasMany(Client, { foreignKey: "rolId" });

Client.belongsTo(Gender, { foreignKey: 'genderId' });
Gender.hasMany(Client, { foreignKey: 'genderId' });

export default Client;
