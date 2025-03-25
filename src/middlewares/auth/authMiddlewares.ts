import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "types/express";

const COOKIE_NAME = "auth_token";
declare module "express" {
    interface Request {
        user?: UserPayload;
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
        res.status(401).json({ message: "Acceso denegado. No hay token." });
        return;
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        console.error("Error: ACCESS_TOKEN_SECRET no está definido.");
        res.status(500).json({ message: "Error interno del servidor" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (typeof decoded === "object" && "id" in decoded) {
            req.user = decoded as UserPayload;
            return next();
        } else {
            res.status(403).json({ message: "Token inválido" });
            return;
        }
    } catch (error) {
        res.status(403).json({ message: "Token no válido" });
        console.error(error);
        return;
    }
};

export default authMiddleware;
