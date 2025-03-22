export interface UserPayload {
    id: number;
    email: string;
    rolId: number;
    employerId: number,
    clientId: number,
}

declare module "express-serve-static-core" {
    interface Request {
        user?: UserPayload;
    }
}