import { Router } from "express";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory
} from "../controllers/CategoryController";
// Middleware
import { checkRole } from "../middlewares/CheckRole";
import authMiddleware from "../middlewares/auth/authMiddlewares";
// Const
import { Roles } from "../constants/Role";

const router = Router();

const { ADMIN, MANAGER } = Roles;

// Get
router.get("/", authMiddleware, checkRole(Object.values(Roles).filter((role) => typeof role === "number")), getAllCategories);
// Post
router.post("/create", authMiddleware, checkRole([ADMIN, MANAGER]), createCategory);
// Update
router.put("/update/:id", authMiddleware, checkRole([ADMIN, MANAGER]), updateCategory);
// Delete
router.delete("/disabled/:id", authMiddleware, checkRole([ADMIN, MANAGER]), deleteCategory);
// Gets especials
router.get("/:categoryId/products", authMiddleware, checkRole(Object.values(Roles).filter((role) => typeof role === "number")), getProductsByCategory);


export default router;