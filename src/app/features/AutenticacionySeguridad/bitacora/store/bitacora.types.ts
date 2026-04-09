export interface Bitacora {
  id_bitacora: number;
  fecha_hora: string;
  usuario_id: number | null;
  usuario_nombre: string;
  accion: string;
  accion_display: string;
  descripcion: string;
  ip: string | null;
  user_agent: string;
  modulo: string | null;
  modulo_display: string | null;
  entidad_tipo: string;
  entidad_id: string;
  resultado: string;
  resultado_display: string;
  metadatos: Record<string, any>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BitacoraFilters {
  page?: number;
  descripcion?: string;
  modulo?: string;
  accion?: string;
  resultado?: string;
  fecha_desde?: string; // Formato ISO 8601 (Ej: 2026-04-08)
  fecha_hasta?: string; // Formato ISO 8601 (Ej: 2026-04-08)
}