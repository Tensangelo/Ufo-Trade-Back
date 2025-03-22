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
// Const
import { Roles } from "../constants/Role";

const router = Router();

const { ADMIN, MANAGER } = Roles;

//Gets
router.get("/", checkRole(Object.values(Roles).filter((role) => typeof role === "number")), getAllProduct);
// Search Products
router.get("/search", checkRole(Object.values(Roles).filter((role) => typeof role === "number")), searchProduct);
// Post
router.post("/create", checkRole([ADMIN, MANAGER]), createProduct);
// Update
router.put("/update/:id", checkRole([ADMIN, MANAGER]), updateProduct)
// Delete
router.delete("/disabled/:id", checkRole([ADMIN, MANAGER]), deleteProduct)

export default router;