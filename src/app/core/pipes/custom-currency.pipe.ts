import { Pipe, PipeTransform } from '@angular/core';

// Formatea un número como moneda, con soporte para PEN, USD y EUR.
// Uso en template: {{ precio | customCurrency }} o {{ precio | customCurrency:'USD' }}
@Pipe({ name: 'customCurrency', standalone: true })
export class CustomCurrencyPipe implements PipeTransform {

  transform(value?: number | null, currency = 'PEN'): string {
    if (value === null || value === undefined) return '—';

    const localeMap: Record<string, string> = {
      PEN: 'es-PE',
      USD: 'en-US',
      EUR: 'es-ES',
    };

    const locale = localeMap[currency] ?? 'es-PE';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
