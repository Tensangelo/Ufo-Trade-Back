import { Router } from "express";
import {
    getAllClients,
    searchClients,
    updateClient,
} from "../controllers/ClientController";

// Middleware
import { checkRole } from "../middlewares/CheckRole";
import authMiddleware from "../middlewares/auth/authMiddlewares";
// Const
import { Roles } from "../constants/Role";

const router = Router();

const { ADMIN, MANAGER, SALES_PERSON } = Roles;

// Gets
router.get("/", authMiddleware, checkRole([ADMIN, MANAGER, SALES_PERSON]), getAllClients);
// Search Clients
router.get("/search", authMiddleware, checkRole([ADMIN, MANAGER, SALES_PERSON]), searchClients);
// Update
router.put("/update/:id", authMiddleware, checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), updateClient);


export default router;