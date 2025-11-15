import { getConnection, sql } from "../config/db.js";

/**
 * Obtener hábitos de un usuario
 */
export const obtenerHabitosPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("usuario_id", sql.Int, usuario_id)
      .query(
        "SELECT * FROM HabitosDiarios WHERE usuario_id = @usuario_id ORDER BY fecha_creacion DESC"
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener hábitos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Crear un nuevo hábito
 */
export const crearHabito = async (req, res) => {
  const { usuario_id, nombre, descripcion } = req.body;

  if (!usuario_id || !nombre)
    return res
      .status(400)
      .json({ message: "usuario_id y nombre son obligatorios" });

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("usuario_id", sql.Int, usuario_id)
      .input("nombre", sql.NVarChar, nombre)
      .input("descripcion", sql.NVarChar, descripcion || null)
      .query(
        `INSERT INTO HabitosDiarios (usuario_id, nombre, descripcion)
         VALUES (@usuario_id, @nombre, @descripcion)`
      );

    res.status(201).json({ message: "Hábito creado correctamente" });
  } catch (error) {
    console.error("Error al crear hábito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Marcar un hábito como cumplido hoy
 */
export const marcarCumplidoHoy = async (req, res) => {
  const { id_habito } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_habito", sql.Int, id_habito)
      .query(
        `UPDATE HabitosDiarios
         SET cumplido_hoy = 1,
             fecha_ultima_vez = GETDATE()
         WHERE id_habito = @id_habito`
      );

    res.json({ message: "Hábito marcado como cumplido hoy ✅" });
  } catch (error) {
    console.error("Error al actualizar hábito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Reiniciar el estado de cumplimiento diario
 */
export const reiniciarCumplimiento = async (req, res) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .query(
        `UPDATE HabitosDiarios
         SET cumplido_hoy = 0
         WHERE DATEDIFF(DAY, fecha_ultima_vez, GETDATE()) >= 1`
      );

    res.json({ message: "Estados de hábitos reiniciados correctamente" });
  } catch (error) {
    console.error("Error al reiniciar hábitos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Eliminar un hábito
 */
export const eliminarHabito = async (req, res) => {
  const { id_habito } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_habito", sql.Int, id_habito)
      .query("DELETE FROM HabitosDiarios WHERE id_habito = @id_habito");

    res.json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar hábito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
