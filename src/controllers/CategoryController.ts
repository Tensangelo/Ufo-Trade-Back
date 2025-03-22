import { NextFunction, Request, Response } from "express";
// Models
import Category from "../models/Category";
import Product from "../models/Product";

// Get
export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await Category.findAll({ where: { status: true } });
        res.json(categories);
    } catch (error) {
        console.error("Error obteniendo las categorias:", error);
        next(error);
    }
}

// Post
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({ message: "Debe asignar un nombre a la categoria" });
            return;
        }

        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            res.status(409).json({ message: "La categoría ya existe" });
            return;
        }

        const newCategory = await Category.create({ name, description });
        res.status(201).json({ message: "Categoría creada exitosamente", category: newCategory });

    } catch (error) {
        console.error("Error creando una categoria", error);
        next(error);
    }
}

// Update (Edit name)
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Categoría no encontrada" });
            return;
        }

        if (name) {
            const existingCategory = await Category.findOne({ where: { name } });
            if (existingCategory && existingCategory.id !== category.id) {
                res.status(409).json({ message: "Ya existe una categoría con este nombre" });
                return;
            }
        }

        await category.update({
            name: name || category.name,
            description: description || category.description,
            status: status !== undefined ? status : category.status
        });

        res.json({ message: "Categoría actualizada exitosamente", category });

    } catch (error) {
        console.error("Error actualizando la categoría:", error);
        next(error);
    }
};

// Delete soft
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            res.status(404).json({ message: "Categoria no encontrada" });
            return;
        }

        await category.update({ status: false });
        res.json({ message: "Categoria desactivada exitosamente" });

    } catch (error) {
        console.error("Error desactivando la categoria:", error);
        next(error);
    }
}

// Search producst by category
export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { categoryId } = req.params;

        const products = await Product.findAll({
            where: { categoryId, status: true }
        });

        res.json(products);
    } catch (error) {
        console.error("Error obteniendo productos por categoría:", error);
        next(error);
    }
};