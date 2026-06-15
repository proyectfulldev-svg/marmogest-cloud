import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges,
  SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FormsModule }              from '@angular/forms';
import { MatTableModule }           from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort }      from '@angular/material/sort';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule }         from '@angular/material/tooltip';

import { DataTypeTablePipe }  from '../../../core/pipes/data-type-table.pipe';
import { LoadingService }     from '../../../core/services/loading.service';
import { TableService }       from '../../../core/services/table.service';
import {
  TableColumn, TableActions, TableFilter, TableOrder,
  TablePagination, TableChangeEvent, TableRowAction
} from '../../../core/interfaces/table.interface';
import { ORDER_MAP } from '../../../core/utils/const';

@Component({
  selector: 'app-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
    DataTypeTablePipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnChanges {

  // ── Entradas ─────────────────────────────────────────────
  @Input() data:        any[]         = [];
  @Input() columns:     TableColumn[] = [];
  @Input() actions:     TableActions  = { add: false, search: false };
  @Input() totalItems   = 0;
  @Input() isLoading    = false;
  @Input() pageSize     = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50];

  // ── Salidas ───────────────────────────────────────────────
  @Output() tableChange = new EventEmitter<TableChangeEvent>();
  @Output() rowAction   = new EventEmitter<TableRowAction>();
  @Output() addClick    = new EventEmitter<void>();

  // ── Estado interno ────────────────────────────────────────
  displayedColumns: string[] = [];
  searchValue = '';

  private pagination: TablePagination = { limit: 10, offset: 0 };
  private order: TableOrder           = { orderBy: '', orderType: 'NONE' };
  private filters: TableFilter[]      = [];

  constructor(
    public loadingService: LoadingService,
    private tableService: TableService
  ) {}

  ngOnInit(): void    { this.buildDisplayedColumns(); }
  ngOnChanges(c: SimpleChanges): void {
    if (c['columns']) this.buildDisplayedColumns();
    if (c['pageSize']) this.pagination.limit = this.pageSize;
  }

  private buildDisplayedColumns(): void {
    this.displayedColumns = [...this.columns.map(c => c.key)];
    const hasActions = this.actions.edit || this.actions.delete ||
                       this.actions.viewDetail || this.actions.generateInvoice;
    if (hasActions) this.displayedColumns.push('_actions');
  }

  // ── Eventos de la tabla ───────────────────────────────────
  onSort(sort: Sort): void {
    this.order = { orderBy: sort.active, orderType: ORDER_MAP[sort.direction] };
    this.emit();
  }

  onPage(event: PageEvent): void {
    this.pagination = { limit: event.pageSize, offset: event.pageIndex * event.pageSize };
    this.emit();
  }

  onSearch(): void {
    this.pagination.offset = 0;
    this.emit();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.onSearch();
  }

  private emit(): void {
    this.tableChange.emit({
      filters: this.filters,
      order: this.order,
      pagination: this.pagination,
      search: this.searchValue,
    });
  }

  // ── Acciones de fila ──────────────────────────────────────
  edit(row: any):    void { this.rowAction.emit({ type: 'edit',    row }); }
  delete(row: any):  void { this.rowAction.emit({ type: 'delete',  row }); }
  view(row: any):    void { this.rowAction.emit({ type: 'view',    row }); }
  invoice(row: any): void { this.rowAction.emit({ type: 'invoice', row }); }

  // ── Helpers para CSS de badges ────────────────────────────
  getStockClass(value: string): string {
    const map: Record<string, string> = {
      IN_STOCK: 'badge-in-stock', LOW_STOCK: 'badge-low-stock',
      OUT_OF_STOCK: 'badge-out-of-stock', IN_TRANSIT: 'badge-in-transit',
    };
    return `badge ${map[value] ?? 'badge-draft'}`;
  }

  getInvoiceClass(value: string): string {
    const map: Record<string, string> = {
      PAID: 'badge-paid', PENDING: 'badge-pending',
      OVERDUE: 'badge-overdue', DRAFT: 'badge-draft',
    };
    return `badge ${map[value] ?? 'badge-draft'}`;
  }

  getStatusClass(value: boolean): string {
    return `badge ${value ? 'badge-active' : 'badge-inactive'}`;
  }
}
