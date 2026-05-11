import { Select, SelectGroup } from '../interfaces/select.interface';
import { TableActions } from '../interfaces/table.interface';

// ── Estado general ────────────────────────────────────────────
export const STATUS: Select[] = [
  { value: true,  label: 'Activo' },
  { value: false, label: 'Inactivo' },
];

// ── Estados de stock ──────────────────────────────────────────
export const STATUS_STOCK: Select[] = [
  { value: 'IN_STOCK',     label: 'En Stock' },
  { value: 'LOW_STOCK',    label: 'Stock Bajo' },
  { value: 'OUT_OF_STOCK', label: 'Agotado' },
  { value: 'IN_TRANSIT',   label: 'En Tránsito' },
];

// ── Estados de factura ────────────────────────────────────────
export const STATUS_INVOICE: Select[] = [
  { value: 'PAID',    label: 'Pagada' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'OVERDUE', label: 'Vencida' },
  { value: 'DRAFT',   label: 'Borrador' },
];

// ── Tipos de material ─────────────────────────────────────────
export const MATERIAL_TYPES: Select[] = [
  { value: 'MARBLE',     label: 'Mármol' },
  { value: 'GRANITE',    label: 'Granito' },
  { value: 'TRAVERTINE', label: 'Travertino' },
  { value: 'QUARTZ',     label: 'Cuarzo' },
  { value: 'ONYX',       label: 'Ónice' },
  { value: 'LIMESTONE',  label: 'Caliza' },
];

// ── Acabados de material ──────────────────────────────────────
export const MATERIAL_FINISHES: Select[] = [
  { value: 'POLISHED',  label: 'Pulido' },
  { value: 'MATTE',     label: 'Mate' },
  { value: 'BRUSHED',   label: 'Cepillado' },
  { value: 'TUMBLED',   label: 'Envejecido' },
  { value: 'SANDBLASTED', label: 'Arenado' },
];

// ── Unidades de medida ────────────────────────────────────────
export const UNITS: Select[] = [
  { value: 'm2',   label: 'm²' },
  { value: 'kg',   label: 'kg' },
  { value: 'ton',  label: 'Tonelada' },
  { value: 'pieza', label: 'Pieza' },
  { value: 'ml',   label: 'ml (metro lineal)' },
];

// ── Tipos de cliente ──────────────────────────────────────────
export const CLIENT_TYPES: Select[] = [
  { value: 'NATURAL',  label: 'Persona Natural' },
  { value: 'COMPANY',  label: 'Empresa' },
  { value: 'ARCHITECT', label: 'Arquitecto / Diseñador' },
  { value: 'CONTRACTOR', label: 'Contratista' },
];

// ── Monedas ───────────────────────────────────────────────────
export const CURRENCIES: Select[] = [
  { value: 'PEN', label: 'Soles (S/)' },
  { value: 'USD', label: 'Dólares ($)' },
  { value: 'EUR', label: 'Euros (€)' },
];

// ── Grupos de material para select con agrupación ─────────────
export const MATERIAL_COLORS: SelectGroup[] = [
  { group: 'Blancos', items: [
    { value: 'BIANCO_CARRARA', label: 'Bianco Carrara' },
    { value: 'THASSOS',        label: 'Thassos' },
    { value: 'SIVEC',          label: 'Sivec' },
  ]},
  { group: 'Negros', items: [
    { value: 'NERO_MARQUINA',  label: 'Nero Marquina' },
    { value: 'NERO_PORTORO',   label: 'Nero Portoro' },
  ]},
  { group: 'Beige', items: [
    { value: 'CREMA_MARFIL',   label: 'Crema Marfil' },
    { value: 'BOTTICINO',      label: 'Botticino' },
    { value: 'LIMA_LIGHT',     label: 'Lima Light' },
  ]},
  { group: 'Verdes', items: [
    { value: 'VERDE_GUATEMALA', label: 'Verde Guatemala' },
    { value: 'VERDE_MING',      label: 'Verde Ming' },
  ]},
];

// ── Acciones de tabla por defecto (todo deshabilitado) ────────
export const DEFAULT_TABLE_ACTIONS: TableActions = {
  add: false, edit: false, delete: false,
  search: false, canFilter: false,
};

// ── Ordenamiento ──────────────────────────────────────────────
export const ORDER_MAP: Record<string, 'ASC' | 'DESC' | 'NONE'> = {
  asc: 'ASC', desc: 'DESC', '': 'NONE',
};
