import { getConnection, sql } from "../config/db.js";

/**
 * Obtener todas las tareas de un usuario
 */
export const obtenerTareasPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("usuario_id", sql.Int, usuario_id)
      .query(
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
export const crearTarea = async (req, res) => {
  const { usuario_id, titulo, descripcion, categoria, fecha_vencimiento } =
    req.body;

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
      .input("descripcion", sql.NVarChar, descripcion || null)
      .input("categoria", sql.NVarChar, categoria || null)
      .input("fecha_vencimiento", sql.DateTime, fecha_vencimiento || null)
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
export const actualizarTarea = async (req, res) => {
  const { id_tarea } = req.params;
  const { titulo, descripcion, categoria, fecha_vencimiento, completada } =
    req.body;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_tarea", sql.Int, id_tarea)
      .input("titulo", sql.NVarChar, titulo)
      .input("descripcion", sql.NVarChar, descripcion)
      .input("categoria", sql.NVarChar, categoria)
      .input("fecha_vencimiento", sql.DateTime, fecha_vencimiento)
      .input("completada", sql.Bit, completada)
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
export const eliminarTarea = async (req, res) => {
  const { id_tarea } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_tarea", sql.Int, id_tarea)
      .query("DELETE FROM Tareas WHERE id_tarea = @id_tarea");

    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
