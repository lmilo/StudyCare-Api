import { Request, Response } from "express";
import { getConnection, sql } from "../config/db";
import { RecursoEducativo } from "../interfaces/recursoEducativo";

/**
 * Tipos para los parámetros y body
 */
interface ParamsCategoria {
  categoria: string;
}

interface ParamsRecurso {
  id_recurso: string;
}

interface BodyRecurso {
  titulo: string;
  descripcion?: string | null;
  categoria?: string | null;
  tipo?: string;
  url?: string | null;
  autor?: string | null;
}


export const obtenerRecursos = async (
  req: Request,
  res: Response<RecursoEducativo[]>
): Promise<void> => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM RecursosEducativos ORDER BY fecha_publicacion DESC");

    const recursos: RecursoEducativo[] = result.recordset;

    res.json(recursos);
  } catch (error) {
    console.error("Error al obtener recursos:", error);
    res.status(500).json({ message: "Error interno del servidor" } as any);
  }
};

export const obtenerRecursosPorCategoria = async (
  req: Request<ParamsCategoria>,
  res: Response<RecursoEducativo[]>
): Promise<void> => {
  const { categoria } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("categoria", sql.NVarChar, categoria)
      .query(
        "SELECT * FROM RecursosEducativos WHERE categoria = @categoria ORDER BY fecha_publicacion DESC"
      );

    const recursos: RecursoEducativo[] = result.recordset;

    res.json(recursos);
  } catch (error) {
    console.error("Error al filtrar recursos:", error);
    res.status(500).json({ message: "Error interno del servidor" } as any);
  }
};


export const crearRecurso = async (
  req: Request<{}, {}, BodyRecurso>,
  res: Response
): Promise<void> => {
  const { titulo, descripcion, categoria, tipo, url, autor } = req.body;

  if (!titulo) {
    res.status(400).json({ message: "El título del recurso es obligatorio" });
    return;
  }

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

export const actualizarRecurso = async (
  req: Request<ParamsRecurso, {}, BodyRecurso>,
  res: Response
): Promise<void> => {
  const { id_recurso } = req.params;
  const { titulo, descripcion, categoria, tipo, url, autor } = req.body;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_recurso", sql.Int, Number(id_recurso))
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

export const eliminarRecurso = async (
  req: Request<ParamsRecurso>,
  res: Response
): Promise<void> => {
  const { id_recurso } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id_recurso", sql.Int, Number(id_recurso))
      .query(
        "DELETE FROM RecursosEducativos WHERE id_recurso = @id_recurso"
      );

    res.json({ message: "Recurso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar recurso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
