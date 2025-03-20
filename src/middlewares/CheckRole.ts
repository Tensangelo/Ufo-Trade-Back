import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar si el usuario tiene un rol permitido
 * @param allowedRoles - Lista de roles permitidos para acceder al recurso
*/

// export const checkRole = (allowedRoles: number[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             return res.status(401).json({ message: "No autenticado" });
//         }

//         if (!allowedRoles.includes(req.user.rolId)) {
//             return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
//         }

//         next();
//     };
// };


// export const checkRole = (allowedRoles: number[]) => {
//     return (req: Request, res: Response, next: NextFunction): void => {
//         if (!req.user || !allowedRoles.includes(req.user.rolId)) {
//             res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
//             return;
//         }
//         next();
//     };
// };


export const checkRole = (roles: number[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Si el endpoint es público, permitir acceso
        if (roles.length === 0) {
            return next();
        }

        // Verifica si el usuario está autenticado
        if (!req.user) {
            res.status(401).json({ message: "No autenticado" });
            return;
        }

        // Verifica si el usuario tiene el rol requerido
        if (!roles.includes(req.user.rolId)) {
            res.status(403).json({ message: "Acceso denegado" });
            return;
        }

        next();
    };
};