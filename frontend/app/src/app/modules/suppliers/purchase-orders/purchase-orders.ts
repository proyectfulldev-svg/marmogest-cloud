import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './purchase-orders.html',
})
export class PurchaseOrders {
  private readonly _ref = inject(MatDialogRef<PurchaseOrders>);

  close(): void { this._ref.close(); }
  save(): void  { this._ref.close(true); }
}
