import { Pipe, PipeTransform } from '@angular/core';
import { TableDataType } from '../interfaces/table.interface';

// Transforma un valor según el tipo de columna antes de mostrarlo en la tabla.
// El componente tabla lo usa internamente para cada celda.
@Pipe({ name: 'dataTypeTable', standalone: true })
export class DataTypeTablePipe implements PipeTransform {

  transform(value: any, dataType: TableDataType): string {
    if (value === null || value === undefined) return '—';

    switch (dataType) {

      case 'currency':
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);

      case 'number':
        return new Intl.NumberFormat('es-PE').format(value);

      case 'date':
        return new Date(value).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

      case 'dateTime':
        return new Date(value).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      case 'weight':
        return `${new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(value)} kg`;

      case 'area':
        return `${new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(value)} m²`;

      case 'percentage':
        return `${value}%`;

      case 'status':
        return value ? 'Activo' : 'Inactivo';

      case 'statusStock':
        return STATUS_STOCK_LABELS[value] ?? value;

      case 'statusInvoice':
        return STATUS_INVOICE_LABELS[value] ?? value;

      case 'text':
      default:
        return String(value);
    }
  }
}

const STATUS_STOCK_LABELS: Record<string, string> = {
  IN_STOCK:    'En Stock',
  LOW_STOCK:   'Stock Bajo',
  OUT_OF_STOCK:'Agotado',
  IN_TRANSIT:  'En Tránsito',
};

const STATUS_INVOICE_LABELS: Record<string, string> = {
  PAID:    'Pagada',
  PENDING: 'Pendiente',
  OVERDUE: 'Vencida',
  DRAFT:   'Borrador',
};
