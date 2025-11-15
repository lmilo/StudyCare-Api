export interface Tarea {
  id_tarea: number;
  usuario_id: number;
  titulo: string;
  descripcion?: string | null;
  categoria?: string | null;
  fecha_vencimiento?: Date | null;
  completada: boolean;
}
