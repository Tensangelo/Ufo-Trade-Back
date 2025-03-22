import { Router } from "express";
import {
    getAllUser,
    getUserProfile,
    updateUserStatus,
    updatePassword
} from '../controllers/UserController';
// Middleware
import { checkRole } from "../middlewares/CheckRole";
// Const
import { Roles } from "../constants/Role";

const router = Router();

const { ADMIN, DEVELOPER, MANAGER } = Roles;

//Gets
router.get("/", checkRole([ADMIN, DEVELOPER, MANAGER]), getAllUser);
//Profile
router.get("/profile", checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), getUserProfile);
// Update State
router.put("/update/:id", checkRole([ADMIN]), updateUserStatus);
// Update Paswword
router.put("/updatePass/:id", checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), updatePassword);

export default router;