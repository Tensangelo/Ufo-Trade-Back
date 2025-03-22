import { Router } from 'express';
import { getAllJobPositions } from '../controllers/JobPositionController';
// Middleware
import { checkRole } from "../middlewares/CheckRole";
// Const
import { Roles } from "../constants/Role";

const router = Router();

// Get
router.get("/", checkRole(Object.values(Roles).filter((role) => typeof role === "number") as number[]), getAllJobPositions);

export default router;