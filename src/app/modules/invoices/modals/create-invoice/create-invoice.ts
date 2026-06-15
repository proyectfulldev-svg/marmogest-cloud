import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [MatIconModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './create-invoice.html',
})
export class CreateInvoice {
  private readonly _ref = inject(MatDialogRef<CreateInvoice>);
  private readonly _fb  = inject(FormBuilder);

  form: FormGroup = this._fb.group({
    cliente_id:  [null],
    material_id: [null],
    descripcion: [''],
  });

  // Mock — reemplazar con llamada al backend
  readonly clientes = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'Arq. Lima & Asoc' },
    { id: 3, nombre: 'Construx SAC' },
  ];

  readonly materiales = [
    { id: 1, nombre: 'Bianco Carrara' },
    { id: 2, nombre: 'Nero Marquina' },
    { id: 3, nombre: 'Crema Marfil' },
  ];

  close(): void { this._ref.close(); }

  save(): void {
    if (this.form.invalid) return;
    this._ref.close(this.form.value);
  }
}
