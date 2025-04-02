import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
// Models
import Employer from "../models/Employer";
import User from "../models/User";
// Utils
import { getPaginationParams } from "../utils/Pagination";

// Gets
export const getAllEmployers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { limit, page, offset } = getPaginationParams(req);
        const totalEmployers = await Employer.count({
            include: [
                {
                    model: User,
                    required: true,
                    where: { isActive: true },
                },
            ],
        });

        const employers = await Employer.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    where: { isActive: true },
                    attributes: [],
                },
            ],
            order: [["id", "ASC"]],
            limit,
            offset,
        });

        res.json({
            currentPage: page,
            limit,
            totalEmployers,
            totalPages: Math.ceil(totalEmployers / limit),
            data: employers,
        });

    } catch (error) {
        console.error("Error obteniendo los empleados:", error);
        next(error);
    }
};

export const searchEmployers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName } = req.query;
        const { limit, page, offset } = getPaginationParams(req);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filters: any = {};

        if (firstName) {
            filters.firstName = {
                [Op.iLike]: `%${firstName}%`,
            };
        }

        if (lastName) {
            filters.lastName = {
                [Op.iLike]: `%${lastName}%`,
            };
        }

        const totalEmployers = await Employer.count({
            where: filters,
            include: [
                {
                    model: User,
                    required: true,
                    where: { isActive: true },
                },
            ],
        });

        if (totalEmployers === 0) {
            res.status(404).json({ error: "No se encontraron empleados" });
            return;
        }

        const employers = await Employer.findAll({
            where: filters,
            include: [
                {
                    model: User,
                    required: true,
                    where: { isActive: true },
                    attributes: [],
                },
            ],
            limit,
            offset,
        });

        res.json({
            currentPage: page,
            limit,
            totalEmployers,
            totalPages: Math.ceil(totalEmployers / limit),
            data: employers,
        });

    } catch (error) {
        console.error("Error buscando empleados:", error);
        next(error);
    }
};

// Post
export const createEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName, email, password, genderId, jobPositionId, birthDate, salary, phone, hiredAt } = req.body;

        if (!firstName || !lastName || !email || !password || !genderId || !jobPositionId) {
            res.status(400).json({ error: "Faltan datos obligatorios" });
            return;
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: "El email ya está en uso" });
            return;
        }

        const newEmployer = await Employer.create({
            firstName,
            lastName,
            email,
            genderId,
            jobPositionId,
            birthDate,
            salary,
            phone,
            hiredAt,
        });

        // Encriptar contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario vinculado al Employer
        const newUser = await User.create({
            employerId: newEmployer.id,
            email,
            password: hashedPassword,
            rolId: jobPositionId,
        });

        res.status(201).json({
            message: "Empleado y usuario creados exitosamente",
            employer: newEmployer,
            user: newUser
        });

    } catch (error) {
        console.error("Error creando el empleado y usuario:", error);
        next(error);
    }
};

// Update
export const updateEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            res.status(400).json({ error: "El ID proporcionado no es válido" });
            return;
        }

        const employer = await Employer.findByPk(id);
        if (!employer) {
            res.status(404).json({ error: "Empleado no encontrado" });
            return;
        }

        const users = await User.findAll({ where: { employerId: employer.id } });

        const allowedFields = ["firstName", "lastName", "salary", "email", "phone", "hiredAt", "birthDate", "genderId"];
        const updates = Object.keys(req.body)
            .filter((key) => allowedFields.includes(key))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .reduce((obj: any, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: "No se proporcionaron campos válidos para actualizar" });
            return;
        }

        if (updates.salary && typeof updates.salary !== "number") {
            res.status(400).json({ error: "El salario debe ser un número" });
            return;
        }
        if (updates.email && !updates.email.includes("@")) {
            res.status(400).json({ error: "Formato de email inválido" });
            return;
        }

        // Verificar si hubo cambios
        const hasChanges = Object.keys(updates).some(
            (key) => JSON.stringify(employer[key as keyof typeof employer]) !== JSON.stringify(updates[key])
        );

        if (!hasChanges) {
            res.status(200).json({ message: "No hubo cambios en la información del empleado" });
            return;
        }

        await employer.update(updates);

        // Si se cambió el email, actualizarlo en Users
        if (updates.email && users.length > 0) {
            // Verificar si el nuevo email ya está en uso
            const emailInUser = await User.findOne({ where: { email: updates.email, employerId: { [Op.ne]: employer.id } } });
            const emailInEmployer = await Employer.findOne({ where: { email: updates.email, id: { [Op.ne]: employer.id } } });
            if (emailInUser && emailInEmployer) {
                res.status(409).json({ error: "El nuevo email ya está en uso" });
                return;
            }

            for (const user of users) {
                if (updates.email !== user.email) {
                    await user.update({ email: updates.email });
                }
            }
        }

        res.status(200).json({
            message: "Empleado actualizado exitosamente",
            employer,
            users
        });

    } catch (error) {
        console.error("Error actualizando el empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        next(error);
    }
};