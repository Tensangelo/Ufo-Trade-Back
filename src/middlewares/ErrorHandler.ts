import { Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorHandler = (err: any, req: Request, res: Response) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    res.status(statusCode).json({
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export default ErrorHandler;