// Respuesta paginada genérica del backend
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;       // página actual (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Parámetros de paginación para enviar al backend
export interface PageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  search?: string;
}

// Redirección de módulo (para el guard de permisos)
export interface ModuleRedirect {
  name: string;
  route: string;
}
