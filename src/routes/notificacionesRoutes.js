import express from "express";
import {
  obtenerNotificacionesPorUsuario,
  crearNotificacion,
  marcarLeida,
  eliminarNotificacion,
} from "../controllers/notificaciones.controller.js";

const router = express.Router();

// Endpoints principales
router.get("/:usuario_id", obtenerNotificacionesPorUsuario); // Ver notificaciones
router.post("/", crearNotificacion);                         // Crear notificación
router.put("/leida/:id_notificacion", marcarLeida);           // Marcar como leída
router.delete("/:id_notificacion", eliminarNotificacion);     // Eliminar notificación

export default router;
