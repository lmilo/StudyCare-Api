export interface RecursoEducativo {
  id_recurso: number;
  titulo: string;
  tipo: string;
  url: string | null;
  categoria: string | null;
  descripcion: string | null;
  autor: string | null;
  fecha_publicacion: Date;
}
