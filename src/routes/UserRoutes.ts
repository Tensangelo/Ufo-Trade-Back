import { Router } from "express";
import {
    getAllUser,
    getUserProfile,
    updateUserStatus,
    updatePassword
} from '../controllers/UserController';
// Middleware
import { checkRole } from "../middlewares/CheckRole";
import authMiddleware from "../middlewares/auth/authMiddlewares";
// Const
import { Roles } from "../constants/Role";

const router = Router();

const { ADMIN, DEVELOPER, MANAGER } = Roles;

//Gets
router.get("/", authMiddleware, checkRole([ADMIN, DEVELOPER, MANAGER]), getAllUser);
//Profile
router.get("/profile", authMiddleware, checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), getUserProfile);
// Update State
router.put("/update/:id", authMiddleware, checkRole([ADMIN]), updateUserStatus);
// Update Paswword
router.put("/updatePass/:id", authMiddleware, checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), updatePassword);

export default router;