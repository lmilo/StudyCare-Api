import express from "express";
import {
  obtenerTareasPorUsuario,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} from "../controllers/tareasController.js";

const router = express.Router();

// Endpoints
router.get("/:usuario_id", obtenerTareasPorUsuario); 
router.post("/", crearTarea);                        
router.put("/:id_tarea", actualizarTarea);           
router.delete("/:id_tarea", eliminarTarea);         

export default router;
