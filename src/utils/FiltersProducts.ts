/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from "sequelize";

export const buildFilters = (queryParams: any) => {
    const filters: any = { status: true };  // Filtro para productos activos por defecto

    if (queryParams.name) {
        filters.name = {
            [Op.iLike]: `%${queryParams.name}%`,  // búsqueda insensible a mayúsculas
        };
    }

    if (queryParams.categoryId) {
        filters.categoryId = queryParams.categoryId;
    }

    // Filtros para el precio mínimo y máximo
    if (queryParams.priceMin) {
        filters.price = { [Op.gte]: queryParams.priceMin };  // Precio mayor o igual
    }
    if (queryParams.priceMax) {
        filters.price = { [Op.lte]: queryParams.priceMax };  // Precio menor o igual
    }

    return filters;
};