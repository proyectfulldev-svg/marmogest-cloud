import { Pipe, PipeTransform } from '@angular/core';
import { FIELD_NAMES } from '../../shared/lang/es/field-names';

// Traduce el nombre técnico de un campo a texto legible en español.
// Lo usa el interceptor de errores para mostrar mensajes como:
// "El campo nombre del material es requerido"
@Pipe({ name: 'field', standalone: true })
export class FieldPipe implements PipeTransform {

  transform(fieldName: string, errorMessage?: string): string {
    const readableName = FIELD_NAMES[fieldName] ?? fieldName;
    if (errorMessage) {
      return `El campo ${readableName} ${errorMessage}`;
    }
    return readableName;
  }
}
