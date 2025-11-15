export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  passwordHash: string;
  rolId: number;
  fechaRegistro: Date;
  estado: boolean;
}
