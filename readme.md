# 🧠 StudyCare API

API desarrollada en **Node.js** con **Express** y **SQL Server**, parte del proyecto StudyCare — plataforma para el bienestar académico y emocional de los estudiantes del TdeA.

---

## 🚀 Tecnologías principales
- Node.js
- Express
- SQL Server
- MSSQL (conector oficial)
- Dotenv (configuración segura)
- CORS (conexión con frontend Angular)

---

## 📂 Estructura del proyecto
```
StudyCare-API/
│
├── src/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ └── usuariosController.js
│ ├── routes/
│ │ └── usuariosRoutes.js
│ └── index.js
│
├── .env
├── package.json
└── package-lock.json
```

---

## ⚙️ Instalación

1. Clona el repositorio o descarga el código.
2. Instala las dependencias:
   ```bash
   npm install
Crea el archivo .env con tus credenciales de SQL Server.

Inicia el servidor:

bash
Copiar código
npm run dev
Abre en tu navegador:
http://localhost:3000/api

🔌 Endpoints iniciales
Método	Ruta	Descripción
GET	/api	Verifica que la API esté funcionando
GET	/api/usuarios	Listar usuarios (requiere controlador)
