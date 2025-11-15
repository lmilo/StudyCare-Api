import { getConnection, sql } from "../config/db.js";

/**
 * Obtener todos los recursos educativos
 */
export const obtenerRecursos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM RecursosEducativos ORDER BY fecha_publicacion DESC");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener recursos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Obtener recursos filtrados por categoría
 */
export const obtenerRecursosPorCategoria = async (req, res) => {
  const { categoria } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("categoria", sql.NVarChar, categoria)
      .query("SELECT * FROM RecursosEducativos WHERE categoria = @categoria ORDER BY fecha_publicacion DESC");

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al filtrar recursos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Crear nuevo recurso educativo
 */
export const crearRecurso = async (req, res) => {
  const { titulo, descripcion, categoria, tipo, url, autor } = req.body;

  if (!titulo)
    return res.status(400).json({ message: "El título del recurso es obligatorio" });

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("titulo", sql.NVarChar, titulo)
      .input("descripcion", sql.NVarChar, descripcion || null)
      .input("categoria", sql.NVarChar, categoria || null)
      .input("tipo", sql.NVarChar, tipo || "Artículo")
      .input("url", sql.NVarChar, url || null)
      .input("autor", sql.NVarChar, autor || "Equipo StudyCare")
      .query(
        `INSERT INTO RecursosEducativos (titulo, descripcion, categoria, tipo, url, autor)
         VALUES (@titulo, @descripcion, @categoria, @tipo, @url, @autor)`
      );

    res.status(201).json({ message: "Recurso educativo creado correctamente" });
  } catch (error) {
    console.error("Error al crear recurso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Actualizar un recurso existente
 */
export const actualizarRecurso = async (req, res) => {
  const { id_recurso } = req.params;
  const { titulo, descripcion, categoria, tipo, url, autor } = req.body;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_recurso", sql.Int, id_recurso)
      .input("titulo", sql.NVarChar, titulo)
      .input("descripcion", sql.NVarChar, descripcion)
      .input("categoria", sql.NVarChar, categoria)
      .input("tipo", sql.NVarChar, tipo)
      .input("url", sql.NVarChar, url)
      .input("autor", sql.NVarChar, autor)
      .query(
        `UPDATE RecursosEducativos
         SET titulo = @titulo,
             descripcion = @descripcion,
             categoria = @categoria,
             tipo = @tipo,
             url = @url,
             autor = @autor
         WHERE id_recurso = @id_recurso`
      );

    res.json({ message: "Recurso actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar recurso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Eliminar un recurso educativo
 */
export const eliminarRecurso = async (req, res) => {
  const { id_recurso } = req.params;

  try {
    const pool = await getConnection();
    await pool.request().input("id_recurso", sql.Int, id_recurso).query("DELETE FROM RecursosEducativos WHERE id_recurso = @id_recurso");
    res.json({ message: "Recurso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar recurso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
