import { Router } from "express";
import {
    getAllProduct,
    searchProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/ProductController";
// Middleware
import { checkRole } from "../middlewares/CheckRole";
import authMiddleware from "../middlewares/auth/authMiddlewares";
// Const
import { Roles } from "../constants/Role";

const router = Router();

const { ADMIN, MANAGER } = Roles;

//Gets
router.get("/", authMiddleware, checkRole(Object.values(Roles).filter((role) => typeof role === "number")), getAllProduct);
// Search Products
router.get("/search", authMiddleware, checkRole(Object.values(Roles).filter((role) => typeof role === "number")), searchProduct);
// Post
router.post("/create", authMiddleware, checkRole([ADMIN, MANAGER]), createProduct);
// Update
router.put("/update/:id", authMiddleware, checkRole([ADMIN, MANAGER]), updateProduct)
// Delete
router.delete("/disabled/:id", authMiddleware, checkRole([ADMIN, MANAGER]), deleteProduct)

export default router;