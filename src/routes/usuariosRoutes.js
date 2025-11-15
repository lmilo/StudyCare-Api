import express from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
} from "../controllers/usuario.controller.js";

const router = express.Router();

router.get("/", obtenerUsuarios); 
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);

export default router;
