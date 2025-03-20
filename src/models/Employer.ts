import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from '../config/database';

// Models
import Gender from './Gender';
import JobPosition from './JobPosition';

class Employer extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public birthDate?: Date;
    public salary?: number;
    public email!: string;
    public phone?: string;
    public hiredAt?: Date;
    public genderId!: number;
    public jobPositionId!: number;
}

Employer.init (
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "first_name",
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "last_name",
        },
        birthDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "birth_date",
        },
        salary: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(250),
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        hiredAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('NOW()'),
            allowNull: true,
            field: "hired_at",
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
        jobPositionId: {
            type: DataTypes.INTEGER,
            references: {
                model: JobPosition,
                key: 'id',
            },
            allowNull: false,
            field: "job_positions_id",
        },
    },
    {
        sequelize,
        modelName: 'Employer',
        tableName: 'employers',
        timestamps: false,
    }
);

Employer.belongsTo(Gender, { foreignKey: 'genderId' });
Gender.hasMany(Employer, { foreignKey: 'genderId' });

Employer.belongsTo(JobPosition, { foreignKey: 'jobPositionId' });
JobPosition.hasMany(Employer, { foreignKey: 'jobPositionId' });

export default Employer;