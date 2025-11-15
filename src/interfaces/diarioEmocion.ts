export interface DiarioEmocion {
  idWmocion: number;
  usuarioId: number;
  fecha: Date;
  emocion?: string | null;
  descripcion?: string | null;
  consejoId?: number | null;
}
