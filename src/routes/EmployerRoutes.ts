import { Router } from "express";
import {
    getAllEmployers,
    createEmployer,
    searchEmployers,
    updateEmployer,
} from "../controllers/EmployerController";
// Middleware
import { checkRole } from "../middlewares/CheckRole";
import authMiddleware from "../middlewares/auth/authMiddlewares";
// Const
import { Roles } from "../constants/Role";

const router = Router();

const { ADMIN, DEVELOPER, MANAGER } = Roles;

// Gets
router.get("/", authMiddleware, checkRole([ADMIN, DEVELOPER, MANAGER]), getAllEmployers);
// Search Employers
router.get("/search", authMiddleware, checkRole([ADMIN, DEVELOPER, MANAGER]), searchEmployers);
// Post
router.post("/create", authMiddleware, checkRole([ADMIN, DEVELOPER, MANAGER]), createEmployer);
// Update
router.put("/update/:id", authMiddleware, checkRole([ADMIN, DEVELOPER, MANAGER]), updateEmployer);

export default router;
