import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Conection db
import sequelize from "@config/database";
// Routes
import employerRoutes from "@routes/EmployerRoutes";
import productRoutes from "@routes/ProductRoutes";
import jobPositionRoutes from "@routes/JobPositionRoutes";
import genderRoutes from "@routes/GenderRoutes";
import categoryRoutes from "@routes/CategoryRoutes";
import clientRoutes from "@routes/ClientRoutes";
import userRoutes from "@routes/UserRoutes";
// Login
import authRoutes from '@routes/auth/authRoutes';
// Middlewares
import ErrorHandler from "@middlewares/ErrorHandler";
import authMiddleware from "@middlewares/auth/authMiddlewares";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
// Lectura de Json y cookies
app.use(express.json());
app.use(cookieParser());
// Login
app.use("/api/auth", authRoutes);
// Generos
app.use("/api/genders", genderRoutes);

app.use(authMiddleware);
// Rutas
app.use("/api/employers", employerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/jobPositions", jobPositionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado a PostgreSQL exitosamente.");
    } catch (error) {
        console.error("❌ Error conectando a la base de datos:", error);
    }
};

testConnection();

// Middleware
app.use(ErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});