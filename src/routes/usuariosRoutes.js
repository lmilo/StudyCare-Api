import express from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
} from "../controllers/usuariosController.js";

const router = express.Router();

router.get("/", obtenerUsuarios); 
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);

export default router;
