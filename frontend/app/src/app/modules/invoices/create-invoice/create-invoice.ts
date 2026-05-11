import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './create-invoice.html',
})
export class CreateInvoice {
  private readonly _ref = inject(MatDialogRef<CreateInvoice>);

  close(): void { this._ref.close(); }
  save(): void  { this._ref.close(true); }
}
