import { Router } from "express";
import {
    getAllEmployers,
    createEmployer,
    searchEmployers,
    updateEmployer,
} from "@controllers/EmployerController";
// Middleware
import { checkRole } from "@middlewares/CheckRole";
// Const
import { Roles } from "@constants/Role";

const router = Router();

const { ADMIN, DEVELOPER, MANAGER } = Roles;

// Gets
router.get("/", checkRole([ADMIN, DEVELOPER, MANAGER]), getAllEmployers);
// Search Employers
router.get("/search", checkRole([ADMIN, DEVELOPER, MANAGER]), searchEmployers);
// Post
router.post("/create", checkRole([ADMIN, DEVELOPER, MANAGER]), createEmployer);
// Update
router.put("/update/:id", checkRole([ADMIN, DEVELOPER, MANAGER]), updateEmployer);

export default router;
