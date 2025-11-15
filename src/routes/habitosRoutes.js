import express from "express";
import {
  obtenerHabitosPorUsuario,
  crearHabito,
  marcarCumplidoHoy,
  reiniciarCumplimiento,
  eliminarHabito,
} from "../controllers/habitosController.js";

const router = express.Router();

// Endpoints principales
router.get("/:usuario_id", obtenerHabitosPorUsuario); // Ver hábitos del usuario
router.post("/", crearHabito);                        // Crear nuevo hábito
router.put("/cumplido/:id_habito", marcarCumplidoHoy); // Marcar cumplido hoy
router.put("/reiniciar", reiniciarCumplimiento);       // Reiniciar hábitos cumplidos
router.delete("/:id_habito", eliminarHabito);          // Eliminar hábito

export default router;
