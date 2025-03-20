import { Request } from "express";

export const getPaginationParams = (req: Request, defaultLimit = 10) => {
    let { limit, page } = req.query;

    let parsedLimit = parseInt(limit as string) || defaultLimit;
    let parsedPage = parseInt(page as string) || 1;

    parsedLimit = Math.min(Math.max(parsedLimit, 10), 50);
    parsedPage = Math.max(parsedPage, 1);

    const offset = (parsedPage - 1) * parsedLimit;

    return {
        limit: parsedLimit,
        page: parsedPage,
        offset
    }
}