import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, first, map, switchMap } from 'rxjs';

// ── Validadores síncronos ─────────────────────────────────────

// Confirma que dos campos de contraseña coincidan.
// Uso: FormGroup con validación: confirmPassword
export function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password        = control.get('password');
  const passwordConfirm = control.get('passwordConfirm');

  if (!password || !passwordConfirm) return null;
  if (passwordConfirm.value && password.value !== passwordConfirm.value) {
    passwordConfirm.setErrors({ confirmPassword: true });
    return { confirmPassword: true };
  }
  return null;
}

// Valida que el RUC tenga exactamente 11 dígitos numéricos (Perú).
export function rucValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  return /^\d{11}$/.test(value) ? null : { ruc: true };
}

// Valida que el DNI tenga exactamente 8 dígitos numéricos (Perú).
export function dniValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  return /^\d{8}$/.test(value) ? null : { dni: true };
}

// Valida que el valor sea un número positivo mayor a cero.
export function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = parseFloat(control.value);
  if (isNaN(value)) return null;
  return value > 0 ? null : { positiveNumber: true };
}

// Valida que el valor sea un número dentro de un rango dado.
// Uso: rangeValidator(0, 100) → ValidatorFn
export function rangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;
    return value >= min && value <= max ? null : { range: { min, max, actual: value } };
  };
}

// Valida que el formato de precio tenga máximo 2 decimales.
export function priceFormatValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  if (!value) return null;
  return /^\d+(\.\d{1,2})?$/.test(value) ? null : { priceFormat: true };
}

// ── Validadores asíncronos ────────────────────────────────────

// Verifica que el código de material no exista ya en la BD.
// service: objeto con método checkCode(code: string): Observable<boolean>
// editingCode: código actual (al editar, no validar contra sí mismo)
export function existMaterialCode(
  service: { checkCode: (code: string) => Observable<boolean> },
  editingCode = ''
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value === editingCode) return [null];
        return service.checkCode(value).pipe(
          map(exists => exists ? { codeTaken: true } : null)
        );
      }),
      first()
    );
  };
}
