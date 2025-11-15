import { Request, Response } from "express";
import { getConnection, sql } from "../config/db";
import { Notificacion, ParamsUsuario, BodyCrearNotificacion,ParamsNotificacion } from "../interfaces/notificacion";

export const obtenerNotificacionesPorUsuario = async (
  req: Request<ParamsUsuario>,
  res: Response<Notificacion[]>
): Promise<void> => {
  const { usuario_id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("usuario_id", sql.Int, Number(usuario_id))
      .query(
        "SELECT * FROM Notificaciones WHERE usuario_id = @usuario_id ORDER BY fecha_envio DESC"
      );

    const notificaciones: Notificacion[] = result.recordset;

    res.json(notificaciones);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" } as any);
  }
};

export const crearNotificacion = async (
  req: Request<{}, {}, BodyCrearNotificacion>,
  res: Response
): Promise<void> => {
  const { usuario_id, titulo, mensaje, tipo } = req.body;

  if (!usuario_id || !titulo) {
    res
      .status(400)
      .json({ message: "usuario_id y título son obligatorios" });
    return;
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("usuario_id", sql.Int, usuario_id)
      .input("titulo", sql.NVarChar, titulo)
      .input("mensaje", sql.NVarChar, mensaje || null)
      .input("tipo", sql.NVarChar, tipo || "General")
      .query(
        `INSERT INTO Notificaciones (usuario_id, titulo, mensaje, tipo)
         VALUES (@usuario_id, @titulo, @mensaje, @tipo)`
      );

    res.status(201).json({ message: "Notificación creada correctamente" });
  } catch (error) {
    console.error("Error al crear notificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const marcarLeida = async (
  req: Request<ParamsNotificacion>,
  res: Response
): Promise<void> => {
  const { id_notificacion } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_notificacion", sql.Int, Number(id_notificacion))
      .query(
        "UPDATE Notificaciones SET leida = 1 WHERE id_notificacion = @id_notificacion"
      );

    res.json({ message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error al marcar notificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Eliminar una notificación
 */
export const eliminarNotificacion = async (
  req: Request<ParamsNotificacion>,
  res: Response
): Promise<void> => {
  const { id_notificacion } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_notificacion", sql.Int, Number(id_notificacion))
      .query(
        "DELETE FROM Notificaciones WHERE id_notificacion = @id_notificacion"
      );

    res.json({ message: "Notificación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar notificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
