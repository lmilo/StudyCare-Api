import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tareasRoutes from "./routes/tareasRoutes.js";
import habitosRoutes from "./routes/habitosRoutes.js";
import diarioEmocionesRoutes from "./routes/diarioEmocionesRoutes.js";
import notificacionesRoutes from "./routes/notificacionesRoutes.js";
import recursosRoutes from "./routes/recursosRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba base
app.get("/api", (req, res) => {
  res.send("🚀 API StudyCare funcionando correctamente");
});

// Rutas principales
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/habitos", habitosRoutes);
app.use("/api/diario-emociones", diarioEmocionesRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/recursos", recursosRoutes);

// Puerto
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
