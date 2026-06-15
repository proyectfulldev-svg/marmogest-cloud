import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { TableFilter, TableOrder, TablePagination } from '../interfaces/table.interface';

// Construye los HttpParams que la tabla envía al backend en cada consulta.
// Centraliza la lógica para que todos los módulos hablen igual con la API.
@Injectable({ providedIn: 'root' })
export class TableService {

  buildParams(
    pagination: TablePagination,
    order: TableOrder,
    filters: TableFilter[],
    search = ''
  ): HttpParams {
    let params = new HttpParams()
      .set('page', String(pagination.offset / pagination.limit))
      .set('size', String(pagination.limit));

    if (order.orderType !== 'NONE') {
      params = params
        .set('sortBy', order.orderBy)
        .set('sortDir', order.orderType);
    }

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    filters.forEach(f => {
      params = params.set(`filter[${f.key}][${f.operator}]`, String(f.value));
    });

    return params;
  }
}
