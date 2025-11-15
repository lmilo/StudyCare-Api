import { Request, Response } from "express";
import { getConnection, sql } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../interfaces/usuario";


export const registrarUsuario = async (req: Request, res: Response): Promise<Response> => {
  const { nombre, correo, password, rolId } = req.body;

  if (!nombre || !correo || !password || !rolId) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const pool = await getConnection();

    const existe = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .query("SELECT idUsuario FROM Usuarios WHERE correo = @correo");

    if (existe.recordset.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("correo", sql.NVarChar, correo)
      .input("passwordHash", sql.NVarChar, hash)
      .input("rolId", sql.Int, rolId)
      .query(
        `INSERT INTO Usuarios (nombre, correo, passwordHash, rolId)
         VALUES (@nombre, @correo, @passwordHash, @rolId)`
      );

    return res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const loginUsuario = async (req: Request, res: Response): Promise<Response> => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: "Correo y contraseña requeridos" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .query("SELECT * FROM Usuarios WHERE correo = @correo");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario: Usuario = result.recordset[0];

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        rolId: usuario.rolId,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "4h" }
    );

    return res.json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rolId: usuario.rolId,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const recuperarContraseña = async (req: Request, res: Response): Promise<Response> => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ message: "El correo es obligatorio" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .query("SELECT idUsuario FROM Usuarios WHERE correo = @correo");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    const usuarioId = result.recordset[0].idUsuario;

    const token = jwt.sign(
      { idUsuario: usuarioId },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .input("token", sql.NVarChar, token)
      .input("expiracion", sql.DateTime, new Date(Date.now() + 15 * 60 * 1000))
      .query(
        `INSERT INTO RecuperacionPassword (usuarioId, token, expiracion, usado)
         VALUES (@usuarioId, @token, @expiracion, 0)`
      );

    return res.json({
      message: "Token de recuperación generado correctamente",
      token,
    });
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
