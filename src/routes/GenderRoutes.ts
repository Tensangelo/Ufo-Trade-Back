import { Router } from "express";
import { getAllGender } from "@controllers/GenderController";

const router = Router();

// Get
router.get("/", getAllGender);

export default router;