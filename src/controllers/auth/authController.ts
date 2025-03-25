import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// Models
import Client from '../../models/Client';
import User from '../../models/User';
// Cookie
const COOKIE_NAME = "auth_token";

export const getSession = (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "No hay sesión activa" });
        return;
    }

    res.json({
        message: "Sesión activa",
        user: req.user,
    });
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos." });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, rolId: user.rolId },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "2h" }
        );

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 2 * 60 * 60 * 1000, // 2 horas
        });

        // Enviar respuesta
        res.json({
            message: "Inicio de sesión exitoso",
            user: {
                id: user.id,
                email: user.email,
                rolId: user.rolId,
                idEmployer: user.employerId,
                idClient: user.clientId
            },
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno del servidor." });
        next(error);
    }
};

export const Register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, phone, address, birthDate, genderId, password } = req.body;

        if (!name || !email || !password || !genderId) {
            res.status(400).json({ error: "Faltan datos obligatorios" });
            return;
        }

        const existingClient = await Client.findOne({ where: { email } });
        if (existingClient) {
            res.status(409).json({ error: "El email ya está registrado" });
            return;
        }

        // Usuario base
        const rolClient = 5;

        const newClient = await Client.create({
            name,
            email,
            phone,
            address,
            birthDate,
            rolId: rolClient,
            genderId,
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            clientId: newClient.id,
            email,
            password: hashedPassword,
            rolId: rolClient,
        })

        res.status(201).json({
            message: "Cliente registrado exitosamente",
            client: newClient,
            user: newUser,
        });

    } catch (error) {
        console.error("Error registrando cliente:", error);
        next(error);
    }
};

export const Logout = (req: Request, res: Response) => {
    if (!req.cookies[COOKIE_NAME]) {
        res.status(400).json({ message: "No hay sesión activa" });
        return;
    }

    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"  // Asegurar que se borre correctamente en todas las rutas
    });

    res.status(200).json({ message: "Sesión cerrada correctamente" });
    return;
};