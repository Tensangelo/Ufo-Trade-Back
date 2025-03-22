import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
// Models
import User from "../models/User";
import Employer from "../models/Employer";
import Client from "../models/Client";
import JobPosition from "../models/JobPosition";
// Utils
import { getPaginationParams } from "../utils/Pagination";

export const getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { limit, page, offset } = getPaginationParams(req);
        const totalUsers = await User.count({ where: { isActive: true } })

        const users = await User.findAll({
            attributes: ["id", "email", "is_active", "created_at", "updated_at"],
            include: [
                {
                    model: Employer,
                    attributes: ["id", "first_name", "last_name", "job_positions_id"],
                    include: [
                        {
                            model: JobPosition,
                            attributes: ["name"],
                        }
                    ]
                },
                {
                    model: Client,
                    attributes: ["id", "name", "phone"],
                },
            ],
            where: { isActive: true },
            limit,
            offset,
        });

        res.json({
            currentPage: page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            data: users,
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};
// GetProfile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(400).json({ message: "Usuario no autenticado" });
            return;
        }

        // Buscar al usuario en la tabla User
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        let profile;

        if (user.clientId) {
            // Es un cliente
            profile = await Client.findByPk(user.clientId);
        } else if (user.employerId) {
            // Es un empleado
            profile = await Employer.findByPk(user.employerId);
        }

        if (!profile) {
            res.status(404).json({ message: "Perfil no encontrado" });
            return;
        }

        res.json(profile);
    } catch (error) {
        next(error);
    }
};

// Update status
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (isNaN(Number(id))) {
            res.status(400).json({ error: "El ID proporcionado no es válido" });
            return;
        }

        if (typeof isActive !== "boolean") {
            res.status(400).json({ error: "El estado isActive debe ser un valor booleano" });
            return;
        }

        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        // Verificar si realmente hay un cambio en isActive
        if (user.isActive === isActive) {
            res.status(200).json({ message: "No hubo cambios en el estado del usuario" });
            return;
        }

        await user.update({ isActive });

        res.status(200).json({
            message: `Usuario ${isActive ? "activado" : "desactivado"} correctamente`,
            user,
        });

    } catch (error) {
        console.error("Error actualizando el estado del usuario:", error);
        next(error);
    }
};

// Update Password
export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { oldPassword, newPassword } = req.body;

        if (!userId) {
            res.status(400).json({ error: "Usuario no autenticado" });
            return;
        }

        if (!oldPassword || !newPassword) {
            res.status(400).json({ error: "Se requieren la contraseña actual y la nueva contraseña" });
            return;
        }

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "La contraseña actual es incorrecta" });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error("Error actualizando la contraseña:", error);
        next(error);
    }
};

