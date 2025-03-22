import { NextFunction, Request, Response } from "express";
// Models
import Product from "../models/Product";
import Category from "../models/Category";
// Utils
import { buildFilters } from "../utils/FiltersProducts";
import { getPaginationParams } from "../utils/Pagination";

// Gets
export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, page, offset } = getPaginationParams(req);
        const totalProducts = await Product.count({
            where: { status: true },
            include: [{
                model: Category,
                where: { status: true } // Solo categorías activas
            }]
        })

        const products = await Product.findAll({
            where: { status: true },
            include: [{
                model: Category,
                where: { status: true }
            }],
            limit,
            offset,
        });

        res.json({
            currentPage: page,
            limit,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            data: products,
        });

    } catch (error) {
        console.error('Error obteniendo los productos', error);
        next(error);
    }
};

export const searchProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters = buildFilters(req.query);
        const { limit, page, offset } = getPaginationParams(req);

        const totalProducts = await Product.count({ where: filters });

        if (totalProducts === 0) {
            res.status(404).json({ error: "No se encontraron productos relacionados" });
            return;
        }

        const products = await Product.findAll({
            where: filters,
            limit,
            offset,
        })

        res.json({
            currentPage: page,
            limit,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            data: products,
        });
    } catch (error) {
        console.error("Error buscando empleados", error);
        next(error);
    }
};

// Post
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description, price, stock, createdAt, categoryId, status } = req.body;

        if (!name || !price || !stock || !categoryId) {
            res.status(400).json({ error: "Faltan datos obligatorios" });
            return;
        }

        if (typeof price !== 'number' || price <= 0) {
            res.status(400).json({ error: 'El precio debe ser un número mayor a 0' });
            return;
        }

        if (typeof stock !== 'number' || isNaN(stock) || stock < 0) {
            res.status(400).json({ error: 'El stock debe ser un número positivo' });
            return;
        }

        const existingProducts = await Product.findOne({ where: { name } });
        if (existingProducts) {
            res.status(409).json({ error: 'El producto ya esta registrado con el mismo nombre' });
            return;
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            createdAt,
            categoryId,
            status: status !== undefined ? status : true,
        });

        res.status(201).json({ status: 'success', message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        console.error("Error creando el producto:", error);
        res.status(400).json({ error: 'Datos inválidos en el producto' });
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return
        }

        const allowedFields = ["name", "description", "price", "stock", "categoryId"];
        const updates: Partial<Product> = Object.keys(req.body)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key as keyof Product] = req.body[key];
                return obj;
            }, {} as Partial<Product>);

        // Si se está cambiando la categoría, validar que la nueva categoría sea válida y esté activa
        if (updates.categoryId) {
            const category = await Category.findByPk(updates.categoryId);
            if (!category || !category.status) {
                res.status(400).json({ error: "La nueva categoría no es válida o está desactivada" });
                return;
            }
        }

        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: "No se han realizado cambios válidos" });
            return;
        }

        await product.update(updates);

        res.status(200).json({ message: "Producto actualizado exitosamente", product });
    } catch (error) {
        console.error("Error actualizando el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
        next(error);
    }
};

// Delete soft
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }

        product.status = false;
        await product.save();

        res.status(200).json({ message: "Producto desactivado exitosamente" })
    } catch (error) {
        console.error("Error desactivado el producto:", error);
        next(error);
    }
};
