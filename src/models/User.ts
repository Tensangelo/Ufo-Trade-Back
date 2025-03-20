import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from '@config/database';

// Models
import Employer from "./Employer";
import Client from "./Client";
import JobPosition from "./JobPosition";

class User extends Model {
    public id!: number;
    public employerId?: number;
    public clientId?: number;
    public email!: string;
    public password!: string;
    public rolId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public isActive!: Boolean;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        employerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Employer,
                key: "id",
            },
            field: "employer_id",
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Client,
                key: "id",
            },
            field: "client_id",
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rolId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, // Activo por defecto
            field: "is_active",
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false,
    }
);

User.belongsTo(Employer, { foreignKey: "employerId" });
Employer.hasMany(User, { foreignKey: "employerId" });

User.belongsTo(Client, { foreignKey: "clientId" });
Client.hasMany(User, { foreignKey: "clientId" });

User.belongsTo(JobPosition, { foreignKey: "rolId" });
JobPosition.hasMany(User, { foreignKey: "rolId" });

export default User;
