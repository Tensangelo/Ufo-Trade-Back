import { Router } from "express";
import {
    getAllClients,
    searchClients,
    updateClient,
} from "@controllers/ClientController";
import authMiddleware from "@middlewares/auth/authMiddlewares";

// Middleware
import { checkRole } from "@middlewares/CheckRole";
// Const
import { Roles } from "@constants/Role";

const router = Router();

const { ADMIN, MANAGER, SALES_PERSON } = Roles;

// Gets
router.get("/", checkRole([ADMIN, MANAGER, SALES_PERSON]), getAllClients);
// Search Clients
router.get("/search", checkRole([ADMIN, MANAGER, SALES_PERSON]), searchClients);
// Update
router.put("/update/:id", checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), updateClient);


export default router;