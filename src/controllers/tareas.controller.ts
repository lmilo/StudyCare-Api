import { Request, Response } from "express";
import { getConnection, sql } from "../config/db";
import { Tarea } from "../interfaces/tareas";

/**
 * Obtener todas las tareas de un usuario
 */
export const obtenerTareasPorUsuario = async (req: Request, res: Response) => {
  const { usuario_id } = req.params;

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("usuario_id", sql.Int, Number(usuario_id))
      .query<Tarea>(
        "SELECT * FROM Tareas WHERE usuario_id = @usuario_id ORDER BY fecha_vencimiento"
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Crear nueva tarea
 */
export const crearTarea = async (req: Request, res: Response) => {
  const {
    usuario_id,
    titulo,
    descripcion,
    categoria,
    fecha_vencimiento,
  }: Partial<Tarea> = req.body;

  if (!usuario_id || !titulo) {
    return res
      .status(400)
      .json({ message: "usuario_id y titulo son obligatorios" });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("usuario_id", sql.Int, usuario_id)
      .input("titulo", sql.NVarChar, titulo)
      .input("descripcion", sql.NVarChar, descripcion ?? null)
      .input("categoria", sql.NVarChar, categoria ?? null)
      .input("fecha_vencimiento", sql.DateTime, fecha_vencimiento ?? null)
      .query(
        `INSERT INTO Tareas (usuario_id, titulo, descripcion, categoria, fecha_vencimiento)
         VALUES (@usuario_id, @titulo, @descripcion, @categoria, @fecha_vencimiento)`
      );

    res.status(201).json({ message: "Tarea creada correctamente" });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Actualizar tarea existente
 */
export const actualizarTarea = async (req: Request, res: Response) => {
  const { id_tarea } = req.params;

  const {
    titulo,
    descripcion,
    categoria,
    fecha_vencimiento,
    completada,
  }: Partial<Tarea> = req.body;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("id_tarea", sql.Int, Number(id_tarea))
      .input("titulo", sql.NVarChar, titulo ?? null)
      .input("descripcion", sql.NVarChar, descripcion ?? null)
      .input("categoria", sql.NVarChar, categoria ?? null)
      .input("fecha_vencimiento", sql.DateTime, fecha_vencimiento ?? null)
      .input("completada", sql.Bit, completada ?? false)
      .query(
        `UPDATE Tareas
         SET titulo = @titulo,
             descripcion = @descripcion,
             categoria = @categoria,
             fecha_vencimiento = @fecha_vencimiento,
             completada = @completada
         WHERE id_tarea = @id_tarea`
      );

    res.json({ message: "Tarea actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Eliminar tarea
 */
export const eliminarTarea = async (req: Request, res: Response) => {
  const { id_tarea } = req.params;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("id_tarea", sql.Int, Number(id_tarea))
      .query("DELETE FROM Tareas WHERE id_tarea = @id_tarea");

    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
