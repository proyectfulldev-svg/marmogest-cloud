import { Pipe, PipeTransform } from '@angular/core';

export type DateFormat = 'short' | 'medium' | 'long' | 'time' | 'relative';

// Formatea fechas de manera consistente en toda la app.
// Uso en template:
//   {{ factura.fecha | formatDate }}             → "15/06/2025"
//   {{ factura.fecha | formatDate:'long' }}      → "15 de junio de 2025"
//   {{ factura.fecha | formatDate:'relative' }}  → "hace 3 días"
@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {

  transform(value: string | Date | null | undefined, format: DateFormat = 'short'): string {
    if (!value) return '—';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';

    switch (format) {
      case 'short':
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

      case 'medium':
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

      case 'long':
        return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

      case 'time':
        return date.toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      case 'relative':
        return this.toRelative(date);

      default:
        return date.toLocaleDateString('es-PE');
    }
  }

  private toRelative(date: Date): string {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60_000);
    const hours   = Math.floor(diff / 3_600_000);
    const days    = Math.floor(diff / 86_400_000);

    if (minutes < 1)  return 'ahora mismo';
    if (minutes < 60) return `hace ${minutes} min`;
    if (hours < 24)   return `hace ${hours} h`;
    if (days < 7)     return `hace ${days} días`;
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }
}
