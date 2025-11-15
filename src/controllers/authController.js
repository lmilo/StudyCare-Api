import { getConnection, sql } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * POST /api/auth/register
 * Registro de usuario con contraseña encriptada
 */
export const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol_id } = req.body;

  if (!nombre || !correo || !contraseña || !rol_id)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    const pool = await getConnection();

    // Verificar si el correo ya existe
    const existe = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .query("SELECT id_usuario FROM Usuarios WHERE correo = @correo");

    if (existe.recordset.length > 0)
      return res.status(400).json({ message: "El correo ya está registrado" });

    // Encriptar contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // Insertar usuario
    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("correo", sql.NVarChar, correo)
      .input("contraseña_hash", sql.NVarChar, hash)
      .input("rol_id", sql.Int, rol_id)
      .query(
        `INSERT INTO Usuarios (nombre, correo, contraseña_hash, rol_id)
         VALUES (@nombre, @correo, @contraseña_hash, @rol_id)`
      );

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * POST /api/auth/login
 * Validación de credenciales y generación de token JWT
 */
export const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña)
    return res.status(400).json({ message: "Correo y contraseña requeridos" });

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .query("SELECT * FROM Usuarios WHERE correo = @correo");

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const usuario = result.recordset[0];
    const passwordValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña_hash
    );

    if (!passwordValida)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        rol_id: usuario.rol_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol_id: usuario.rol_id,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * POST /api/auth/forgot-password
 * Genera token temporal y lo guarda en la tabla RecuperacionPassword
 */
export const recuperarContraseña = async (req, res) => {
  const { correo } = req.body;

  if (!correo)
    return res.status(400).json({ message: "El correo es obligatorio" });

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .query("SELECT id_usuario FROM Usuarios WHERE correo = @correo");

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Correo no encontrado" });

    const usuarioId = result.recordset[0].id_usuario;
    const token = jwt.sign({ id_usuario: usuarioId }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    await pool
      .request()
      .input("usuario_id", sql.Int, usuarioId)
      .input("token", sql.NVarChar, token)
      .input("expiracion", sql.DateTime, new Date(Date.now() + 15 * 60 * 1000))
      .query(
        `INSERT INTO RecuperacionPassword (usuario_id, token, expiracion, usado)
         VALUES (@usuario_id, @token, @expiracion, 0)`
      );

    res.json({
      message: "Token de recuperación generado correctamente",
      token,
    });
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
