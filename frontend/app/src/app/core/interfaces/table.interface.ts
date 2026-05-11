// Tipos de dato que la tabla sabe renderizar visualmente
export type TableDataType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'dateTime'
  | 'weight'       // kg / ton para materiales
  | 'area'         // m² para losas/bloques
  | 'percentage'
  | 'status'       // activo/inactivo
  | 'statusStock'  // en-stock / bajo-stock / agotado / en-tránsito
  | 'statusInvoice'// pagada / pendiente / vencida / borrador
  | 'badge'        // tipo de material (mármol, granito, travertino...)
  | 'image';

export interface TableColumn {
  name: string;          // Header visible
  key: string;           // Propiedad del objeto a mostrar
  dataType: TableDataType;
  isSortable?: boolean;
  isFilterable?: boolean;
  width?: string;        // ej: '120px', 'auto'
}

export interface TableActions {
  add: boolean;
  edit?: boolean;
  delete?: boolean;
  search: boolean;
  canFilter?: boolean;
  viewDetail?: boolean;     // ver detalle del registro
  generateInvoice?: boolean;// generar factura desde el registro
  addByExcel?: boolean;     // importar desde Excel
}

export interface TableFilter {
  key: string;
  operator: 'eq' | 'like' | 'gte' | 'lte' | 'between';
  value: string | number | boolean;
}

export interface TableOrder {
  orderBy: string;
  orderType: 'ASC' | 'DESC' | 'NONE';
}

export interface TablePagination {
  limit: number;
  offset: number;
}

// Evento emitido hacia el padre cuando cambia algo en la tabla
export interface TableChangeEvent {
  filters: TableFilter[];
  order: TableOrder;
  pagination: TablePagination;
  search: string;
}

// Evento de acción sobre una fila
export interface TableRowAction<T = any> {
  type: 'edit' | 'delete' | 'view' | 'invoice';
  row: T;
}
