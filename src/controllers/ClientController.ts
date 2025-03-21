import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
// Models
import Client from "@models/Client";
import User from "@models/User";
// Utils
import { getPaginationParams } from "@utils/Pagination";

export const getAllClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, offset } = getPaginationParams(req);
        const totalClients = await Client.count({
            include: [
                {
                    model: User,
                    required: true,
                    where: { isActive: true },
                },
            ],
        });

        const clients = await Client.findAll({
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
            totalClients,
            totalPages: Math.ceil(totalClients / limit),
            data: clients,
        });

    } catch (error) {
        console.error("Error obteniendo los clientes:", error);
        next(error);
    }
};

export const searchClients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name } = req.query;
        const { limit, page, offset } = getPaginationParams(req);

        const filters: any = {};
        if (name) {
            filters.name = { [Op.iLike]: `%${name}%` };
        }

        const totalClients = await Client.count({
            where: filters,
            include: [
                {
                    model: User,
                    required: true,
                    where: { isActive: true },
                },
            ],
        });

        if (totalClients === 0) {
            res.status(404).json({ error: "No se encontraron clientes" });
            return;
        }

        const clients = await Client.findAll({
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
            totalClients,
            totalPages: Math.ceil(totalClients / limit),
            data: clients,
        });

    } catch (error) {
        console.error("Error buscando clientes:", error);
        next(error);
    }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            res.status(400).json({ error: "El ID proporcionado no es válido" });
            return;
        }

        const client = await Client.findByPk(id);
        if (!client) {
            res.status(404).json({ error: "Cliente no encontrado" });
            return;
        }

        const user = await User.findOne({
            where: {
                clientId: client.id
            }
        });

        if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        const allowedFields = ["name", "phone", "address", "birthDate", "email", "genderId"];
        const updates: Record<string, any> = {};

        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: "No se proporcionaron campos válidos para actualizar" });
            return;
        }

        const emailChanged = updates.email && updates.email !== client.email;

        if (emailChanged || updates.email === "") {
            res.status(400).json({ error: "El correo electrónico no puede estar vacío" });
            return;
        }

        if (emailChanged) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
                res.status(400).json({ error: "Formato de email inválido" });
                return;
            }

            const emailExists = await User.findOne({
                where: { email: updates.email },
            });

            if (emailExists) {
                res.status(409).json({ error: "El email ya está registrado en otro usuario" });
                return;
            }
        }

        // Verificar si hubo cambios
        const hasChanges = Object.keys(updates).some(
            (key) => client[key as keyof typeof client] !== updates[key]
        );

        if (!hasChanges) {
            res.status(200).json({ message: "No hubo cambios en la información del cliente" });
            return;
        }

        await client.update(updates);

        // Si se cambió el email, actualizarlo en Users
        if (emailChanged) {
            await user.update({ email: updates.email });
        }

        res.status(200).json({
            message: "Cliente actualizado exitosamente",
            client,
            user,
        });

    } catch (error) {
        console.error("Error actualizando cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        next(error);
    }
};