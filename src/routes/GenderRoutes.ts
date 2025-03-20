import { Router } from "express";
import { getAllGender } from "@controllers/GenderController";
// Middleware
import { checkRole } from "@middlewares/CheckRole";
// Const
import { Roles } from "@constants/Role";

const router = Router();

// Get
router.get("/", checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), getAllGender);

export default router;