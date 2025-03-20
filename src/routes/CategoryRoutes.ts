import { Router } from "express";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory
} from "@controllers/CategoryController";
// Middleware
import { checkRole } from "@middlewares/CheckRole";
// Const
import { Roles } from "@constants/Role";

const router = Router();

const { ADMIN, MANAGER } = Roles;

// Get
router.get("/", checkRole(Object.values(Roles).filter((role) => typeof role === "number")), getAllCategories);
// Post
router.post("/create", checkRole([ADMIN, MANAGER]), createCategory);
// Update
router.put("/update/:id", checkRole([ADMIN, MANAGER]), updateCategory);
// Delete
router.delete("/disabled/:id", checkRole([ADMIN, MANAGER]), deleteCategory);
// Gets especials
router.get("/:categoryId/products", checkRole(Object.values(Roles).filter((role) => typeof role === "number")), getProductsByCategory);


export default router;