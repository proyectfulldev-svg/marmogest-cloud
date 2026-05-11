import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CreateInvoice } from '../create-invoice/create-invoice';
import { InvoiceDetails } from '../invoice-details/invoice-details';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
})
export class InvoiceList {
  private readonly _dialog = inject(MatDialog);

  openCreate(): void {
    this._dialog.open(CreateInvoice, { panelClass: 'modal-lg', width: '860px' });
  }

  openDetails(invoiceId: string): void {
    this._dialog.open(InvoiceDetails, {
      panelClass: 'modal-lg',
      width: '860px',
      data: { invoiceId },
    });
  }
}
