import { Request, Response } from "express";
import { getConnection, sql } from "../config/db";
import { Usuario } from ;

export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query<Usuario>("SELECT * FROM Usuarios");

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerUsuarioPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_usuario", sql.Int, Number(id))
      .query<Usuario>(
        "SELECT * FROM Usuarios WHERE id_usuario = @id_usuario"
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * POST /api/usuarios
 * Crea un nuevo usuario
 */
export const crearUsuario = async (req: Request, res: Response) => {
  const { nombre, correo, contraseña_hash, rol_id }: Partial<Usuario> = req.body;

  if (!nombre || !correo || !contraseña_hash || !rol_id) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const pool = await getConnection();

    // Validar correo duplicado
    const existe = await pool
      .request()
      .input("correo", sql.NVarChar, correo)
      .query<Usuario>("SELECT * FROM Usuarios WHERE correo = @correo");

    if (existe.recordset.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("correo", sql.NVarChar, correo)
      .input("contraseña_hash", sql.NVarChar, contraseña_hash)
      .input("rol_id", sql.Int, rol_id)
      .query(
        `INSERT INTO Usuarios (nombre, correo, contraseña_hash, rol_id)
         VALUES (@nombre, @correo, @contraseña_hash, @rol_id)`
      );

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
