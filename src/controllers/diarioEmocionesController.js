import { getConnection, sql } from "../config/db.js";

/**
 * Obtener registros emocionales de un usuario
 */
export const obtenerRegistrosPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("usuario_id", sql.Int, usuario_id)
      .query(
        "SELECT * FROM DiarioEmociones WHERE usuario_id = @usuario_id ORDER BY fecha_registro DESC"
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener registros emocionales:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Crear un nuevo registro emocional
 */
export const crearRegistroEmocional = async (req, res) => {
  const { usuario_id, emocion, descripcion } = req.body;

  if (!usuario_id || !emocion)
    return res
      .status(400)
      .json({ message: "usuario_id y emocion son obligatorios" });

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("usuario_id", sql.Int, usuario_id)
      .input("emocion", sql.NVarChar, emocion)
      .input("descripcion", sql.NVarChar, descripcion || null)
      .query(
        `INSERT INTO DiarioEmociones (usuario_id, emocion, descripcion)
         VALUES (@usuario_id, @emocion, @descripcion)`
      );

    res.status(201).json({ message: "Registro emocional creado correctamente" });
  } catch (error) {
    console.error("Error al crear registro emocional:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Actualizar una entrada del diario emocional
 */
export const actualizarRegistroEmocional = async (req, res) => {
  const { id_registro } = req.params;
  const { emocion, descripcion } = req.body;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_registro", sql.Int, id_registro)
      .input("emocion", sql.NVarChar, emocion)
      .input("descripcion", sql.NVarChar, descripcion)
      .query(
        `UPDATE DiarioEmociones
         SET emocion = @emocion,
             descripcion = @descripcion
         WHERE id_registro = @id_registro`
      );

    res.json({ message: "Registro emocional actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar registro emocional:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Eliminar un registro emocional
 */
export const eliminarRegistroEmocional = async (req, res) => {
  const { id_registro } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_registro", sql.Int, id_registro)
      .query("DELETE FROM DiarioEmociones WHERE id_registro = @id_registro");

    res.json({ message: "Registro emocional eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar registro emocional:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
