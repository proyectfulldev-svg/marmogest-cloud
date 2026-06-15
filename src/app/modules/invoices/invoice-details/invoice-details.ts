import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface InvoiceDialogData {
  invoiceId: string;
}

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './invoice-details.html',
})
export class InvoiceDetails {
  private readonly _ref  = inject(MatDialogRef<InvoiceDetails>);
  readonly data = inject<InvoiceDialogData>(MAT_DIALOG_DATA);

  close(): void { this._ref.close(); }
}
