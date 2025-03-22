import { NextFunction, Request, Response } from "express";
import Gender from "../models/Gender";

export const getAllGender = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const gender = await Gender.findAll();
        res.json(gender);
    } catch (error) {
        console.error("Error al obtener lo generos", error)
        next(error);
    }
};