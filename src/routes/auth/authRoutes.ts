import { Router } from "express";
import { Login, Register, Logout, getSession } from "@controllers/auth/authController";
import authMiddleware from "@middlewares/auth/authMiddlewares";

const router = Router();

router.get("/me", authMiddleware, getSession)

router.post("/login", async (req, res, next) => {
    try {
        await Login(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post("/register", async (req, res, next) => {
    try {
        await Register(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post("/logout", Logout);

export default router;