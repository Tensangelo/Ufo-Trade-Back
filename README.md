# 🚀 UFO-Trade - Backend

Este es el backend de **UFO-Trade**, una plataforma de gestión de usuarios. Construido con **Node.js**, **Express**, **JWT**, **cookies** y **TypeScript**.

## 📌 Tecnologías usadas

- **Node.js + Express.js** - Framework backend  
- **TypeScript** - Tipado estático para JavaScript  
- **JWT** - Autenticación basada en tokens  
- **Cookies** - Manejo de sesiones  
- **PostgreSQL** - Almacenamiento de datos  
- **Sequelize / Prisma** - Manipulación de la base de datos (especificar cuál usaste)  

## 🔒 Autenticación

La autenticación se realiza mediante **JWT + Cookies**.

1. Al iniciar sesión, el backend genera un **JWT** y lo almacena en una **cookie HTTPOnly**.
2. En cada petición autenticada, el frontend debe enviar la cookie para validar la sesión.

## ⚙️ Instalación y configuración

-- **Instala dependencias
-- **Ajusta tus variables de entorno en un archivo .env
-- ** Ejecuta en desarrollo con __npm run dev__
