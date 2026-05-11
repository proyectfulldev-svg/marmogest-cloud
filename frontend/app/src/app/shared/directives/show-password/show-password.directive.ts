import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

// Alterna la visibilidad del campo de contraseña al hacer click en el ícono.
// El ícono debe tener la clase 'toggle-password' y ser hermano del input.
//
// Uso:
//   <div class="input-group">
//     <input type="password" appShowPassword />
//     <span class="toggle-password icon-eye"></span>
//   </div>
@Directive({
  selector: '[appShowPassword]',
  standalone: true,
})
export class ShowPasswordDirective {
  private visible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  toggle(): void {
    this.visible = !this.visible;
    const input = this.el.nativeElement as HTMLInputElement;
    this.renderer.setAttribute(input, 'type', this.visible ? 'text' : 'password');

    const icon = input.parentElement?.querySelector('.toggle-password');
    if (icon) {
      this.renderer.removeClass(icon, this.visible ? 'icon-eye'       : 'icon-eye-open');
      this.renderer.addClass   (icon, this.visible ? 'icon-eye-open'  : 'icon-eye');
    }
  }
}
