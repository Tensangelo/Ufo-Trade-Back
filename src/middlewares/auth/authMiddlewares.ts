import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "types/express";

const COOKIE_NAME = "auth_token";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
        res.status(401).json({ message: "Acceso denegado. No hay token." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

        if (typeof decoded === "object" && "id" in decoded) {
            req.user = decoded as UserPayload;
            next();
        } else {
            res.status(403).json({ message: "Token inválido" });
        }
    } catch (error) {
        res.status(403).json({ message: "Token no válido" });
        console.error(error);
    }
};

export default authMiddleware;
