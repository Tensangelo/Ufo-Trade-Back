import { Router } from 'express';
import { getAllJobPositions } from '@controllers/JobPositionController';
// Middleware
import { checkRole } from "@middlewares/CheckRole";
// Const
import { Roles } from "@constants/Role";

const router = Router();

const { ADMIN, DEVELOPER, MANAGER, SALES_PERSON } = Roles;

// Get
router.get("/", checkRole([ADMIN, DEVELOPER, MANAGER, SALES_PERSON]), getAllJobPositions);

export default router;