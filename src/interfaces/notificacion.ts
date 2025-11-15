export interface Notificacion {
  id_notificacion: number;
  usuario_id: number;
  titulo: string;
  mensaje?: string | null;
  tipo: string;
  leida: boolean;
  fecha_envio: Date;
}


export interface ParamsUsuario {
  usuario_id: string;
}

export interface ParamsNotificacion {
  id_notificacion: string;
}

export interface BodyCrearNotificacion {
  usuario_id: number;
  titulo: string;
  mensaje?: string | null;
  tipo?: string;
}