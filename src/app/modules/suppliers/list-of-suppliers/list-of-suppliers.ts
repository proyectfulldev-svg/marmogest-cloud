import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { PurchaseOrders } from '../purchase-orders/purchase-orders';

@Component({
  selector: 'app-list-of-suppliers',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './list-of-suppliers.html',
  styleUrl: './list-of-suppliers.css',
})
export class ListOfSuppliers {
  private readonly _dialog = inject(MatDialog);

  openPurchaseOrder(): void {
    this._dialog.open(PurchaseOrders, { panelClass: 'modal-md', width: '600px' });
  }
}
