import { Request, Response } from "express";
import { getConnection, sql } from "../config/db.js";
import { DiarioEmocion } from "../interfaces/diarioEmocion";


export const obtenerRegistrosPorUsuario = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { usuarioId } = req.params;

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .query(
        `SELECT * 
         FROM DiarioEmociones 
         WHERE usuarioId = @usuarioId 
         ORDER BY fecha DESC`
      );

    const registros: DiarioEmocion[] = result.recordset;

    return res.json(registros);
  } catch (error) {
    console.error("Error al obtener registros emocionales:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const crearRegistroEmocional = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { usuarioId, emocion, descripcion } = req.body;

  if (!usuarioId || !emocion) {
    return res.status(400).json({
      message: "usuarioId y emocion son obligatorios",
    });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .input("emocion", sql.NVarChar, emocion)
      .input("descripcion", sql.NVarChar, descripcion || null)
      .query(
        `INSERT INTO DiarioEmociones (usuarioId, emocion, descripcion)
         VALUES (@usuarioId, @emocion, @descripcion)`
      );

    return res
      .status(201)
      .json({ message: "Registro emocional creado correctamente" });
  } catch (error) {
    console.error("Error al crear registro emocional:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarRegistroEmocional = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { idWmocion } = req.params;
  const { emocion, descripcion } = req.body;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("idWmocion", sql.Int, idWmocion)
      .input("emocion", sql.NVarChar, emocion)
      .input("descripcion", sql.NVarChar, descripcion ?? null)
      .query(
        `UPDATE DiarioEmociones
         SET emocion = @emocion,
             descripcion = @descripcion
         WHERE idWmocion = @idWmocion`
      );

    return res.json({
      message: "Registro emocional actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar registro emocional:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const eliminarRegistroEmocional = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { idWmocion } = req.params;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("idWmocion", sql.Int, idWmocion)
      .query(`DELETE FROM DiarioEmociones WHERE idWmocion = @idWmocion`);

    return res.json({
      message: "Registro emocional eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar registro emocional:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
