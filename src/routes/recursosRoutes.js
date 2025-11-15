import express from "express";
import {
  obtenerRecursos,
  obtenerRecursosPorCategoria,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
} from "../controllers/recursos.controller.js";

const router = express.Router();

router.get("/", obtenerRecursos);                           // Obtener todos los recursos
router.get("/categoria/:categoria", obtenerRecursosPorCategoria); // Filtrar por categoría
router.post("/", crearRecurso);                             // Crear nuevo recurso
router.put("/:id_recurso", actualizarRecurso);               // Actualizar recurso existente
router.delete("/:id_recurso", eliminarRecurso);              // Eliminar recurso

export default router;
