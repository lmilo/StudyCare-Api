import { Request, Response } from "express";
import { getConnection, sql } from "../config/db.js";
import { HabitoDiario } from "../interfaces/habitoDiario";


export const obtenerHabitosPorUsuario = async (
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
         FROM HabitosDiarios 
         WHERE usuarioId = @usuarioId 
         ORDER BY idHabito DESC`
      );

    const habitos: HabitoDiario[] = result.recordset;

    return res.json(habitos);
  } catch (error) {
    console.error("Error al obtener hábitos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const crearHabito = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { usuarioId, nombre, frecuencia, horaRecordatorio } = req.body;

  if (!usuarioId || !nombre) {
    return res.status(400).json({
      message: "usuarioId y nombre son obligatorios",
    });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .input("nombre", sql.NVarChar, nombre)
      .input("frecuencia", sql.NVarChar, frecuencia || null)
      .input("horaRecordatorio", sql.Time, horaRecordatorio || null)
      .query(
        `INSERT INTO HabitosDiarios (usuarioId, nombre, frecuencia, horaRecordatorio)
         VALUES (@usuarioId, @nombre, @frecuencia, @horaRecordatorio)`
      );

    return res.status(201).json({
      message: "Hábito creado correctamente",
    });
  } catch (error) {
    console.error("Error al crear hábito:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const reiniciarCumplimiento = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pool = await getConnection();

    await pool.request().query(
      `UPDATE HabitosDiarios
       SET progreso = 0 
       WHERE activo = 1`
    );

    return res.json({
      message: "Progreso de hábitos reiniciado correctamente",
    });
  } catch (error) {
    console.error("Error al reiniciar hábitos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const eliminarHabito = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { idHabito } = req.params;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("idHabito", sql.Int, idHabito)
      .query("DELETE FROM HabitosDiarios WHERE idHabito = @idHabito");

    return res.json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar hábito:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
