import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  recuperarContraseña,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);
router.post("/forgot-password", recuperarContraseña);

export default router;
