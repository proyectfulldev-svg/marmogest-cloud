import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

// Emite un evento cuando el usuario hace click FUERA del elemento host.
// Útil para cerrar dropdowns, menús o paneles al hacer click en otro lado.
//
// Uso: <div appClickOutside (clickOutside)="cerrarMenu()">...</div>
@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    if (target && !this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
