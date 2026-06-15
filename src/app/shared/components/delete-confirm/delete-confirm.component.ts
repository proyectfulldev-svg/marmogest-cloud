import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DeleteConfirmData {
  title?:   string;
  message?: string;
  item?:    string; // nombre del registro a eliminar
}

// Modal de confirmación de eliminación reutilizable.
// Uso:
//   this.dialog.open(DeleteConfirmComponent, {
//     data: { item: 'Mármol Bianco Carrara' }
//   }).afterClosed().subscribe(confirmed => {
//     if (confirmed) this.doDelete();
//   });
@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="delete-confirm">
      <h2 class="delete-confirm__title">{{ data.title ?? 'Confirmar eliminación' }}</h2>
      <p class="delete-confirm__message">
        {{ data.message ?? '¿Estás seguro de que deseas eliminar' }}
        @if (data.item) { <strong>{{ data.item }}</strong>? }
        Esta acción no se puede deshacer.
      </p>
      <div class="delete-confirm__actions">
        <button class="btn btn-secondary" (click)="cancel()">Cancelar</button>
        <button class="btn btn-danger"    (click)="confirm()">Eliminar</button>
      </div>
    </div>
  `,
  styles: [`
    .delete-confirm { padding: 8px; max-width: 400px; }
    .delete-confirm__title { font-size: 18px; font-weight: 600; color: #1a1a2e; margin: 0 0 12px; }
    .delete-confirm__message { font-size: 14px; color: #555; line-height: 1.5; margin-bottom: 24px; }
    .delete-confirm__actions { display: flex; gap: 12px; justify-content: flex-end; }
  `],
})
export class DeleteConfirmComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmData
  ) {}

  confirm(): void { this.dialogRef.close(true); }
  cancel():  void { this.dialogRef.close(false); }
}
