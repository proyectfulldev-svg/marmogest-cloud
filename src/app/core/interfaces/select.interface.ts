// Opción genérica para dropdowns / ng-select
export interface Select {
  value: string | number | boolean;
  label: string;
}

// Select con agrupación (ej: Mármol > Blanco Carrara, Nero Marquina)
export interface SelectGroup {
  group: string;
  items: Select[];
}

// Rango de fechas para filtros
export interface RangeDate {
  start: Date;
  end: Date;
}

// ── Selects específicos de Marmogest ─────────────────────────

export interface SupplierSelect {
  supplierId: string;
  supplierName: string;
  country: string;
}

export interface MaterialSelect {
  materialId: string;
  materialName: string;
  materialType: string; // mármol, granito, travertino, cuarzo
  unit: 'm2' | 'kg' | 'ton' | 'pieza';
}

export interface ClientSelect {
  clientId: string;
  clientName: string;
  clientRuc: string;
}

export interface WarehouseSelect {
  warehouseId: string;
  warehouseName: string;
  location: string;
}
