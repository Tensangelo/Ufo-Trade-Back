import { NextFunction, Request, Response } from "express";
import JobPosition from "../models/JobPosition";

export const getAllJobPositions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobPositions = await JobPosition.findAll();
        res.json(jobPositions);
    } catch (error) {
        console.error("Error obteniendo lor roles:", error);
        next(error);
    }
};