import { Request, Response, NextFunction } from "express";

const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    res.status(statusCode).json({
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export default ErrorHandler;