import { Directive, HostListener, Input } from '@angular/core';

export type InputMaskType =
  | 'integer'
  | 'decimal'
  | 'positiveDecimal'  // solo positivos, para m² y precios
  | 'words'
  | 'alphaNumeric'
  | 'ruc'              // 11 dígitos
  | 'dni'              // 8 dígitos
  | 'phone';

// Bloquea en tiempo real caracteres inválidos según el tipo de campo.
// Uso: <input appInputMask="decimal" formControlName="area" />
@Directive({
  selector: '[appInputMask]',
  standalone: true,
})
export class InputMaskDirective {
  @Input('appInputMask') maskType: InputMaskType = 'alphaNumeric';

  private readonly patterns: Record<InputMaskType, RegExp> = {
    integer:         /^[0-9]*$/,
    decimal:         /^[\d.,]*$/,
    positiveDecimal: /^[0-9.]*$/,
    words:           /^[a-zA-ZÀ-ÿ\s]*$/,
    alphaNumeric:    /^[a-zA-Z0-9\s]*$/,
    ruc:             /^[0-9]{0,11}$/,
    dni:             /^[0-9]{0,8}$/,
    phone:           /^[0-9+\-\s]{0,15}$/,
  };

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const pattern = this.patterns[this.maskType];
    const currentValue = (event.target as HTMLInputElement).value + event.key;
    if (pattern && !pattern.test(currentValue)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') ?? '';
    const pattern = this.patterns[this.maskType];
    if (pattern && !pattern.test(pasted)) {
      event.preventDefault();
    }
  }
}
