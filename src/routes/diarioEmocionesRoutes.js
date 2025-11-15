import express from "express";
import {
  obtenerRegistrosPorUsuario,
  crearRegistroEmocional,
  actualizarRegistroEmocional,
  eliminarRegistroEmocional,
} from "../controllers/diarioEmociones.controller.js";

const router = express.Router();

// Endpoints principales
router.get("/:usuario_id", obtenerRegistrosPorUsuario);  // Obtener registros del usuario
router.post("/", crearRegistroEmocional);                // Crear nuevo registro
router.put("/:id_registro", actualizarRegistroEmocional); // Editar registro existente
router.delete("/:id_registro", eliminarRegistroEmocional); // Eliminar registro

export default router;
