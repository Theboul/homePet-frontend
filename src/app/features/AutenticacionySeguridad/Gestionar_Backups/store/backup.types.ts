export interface BackupRestore {
  id_backup_restore: number;
  tipo: "BACKUP" | "RESTORE";
  fecha_hora: string;
  ruta_archivo: string;
  proveedor_almacenamiento: string;
  estado: "INICIADO" | "EXITOSO" | "FALLIDO";
  hash_archivo: string | null;
  motivo: string | null;
  usuario: number;
  usuario_nombre: string;
  usuario_correo: string;
  veterinaria: number;
  veterinaria_nombre: string;
}

export interface BackupConfig {
  id_backup_config: number;
  veterinaria: number;
  veterinaria_nombre: string;
  frecuencia: "DIARIO" | "SEMANAL" | "MENSUAL" | "PERSONALIZADO";
  dias_retención: number;
  último_backup: string | null;
  próximo_backup_programado: string | null;
  activo: boolean;
  creado: string;
  actualizado: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BackupFilters {
  page?: number;
  tipo?: string;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
