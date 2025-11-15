export interface HabitoDiario {
  idHabito: number;
  usuarioId: number;
  nombre: string;
  frecuencia?: string | null;
  horaRecordatorio?: string | null; 
  progreso: number;
  activo: boolean;
}
