import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[validationErrors]',
  standalone: true
})
export class ValidationErrorsDirective implements OnInit, OnDestroy {

  private messages: { [key: string]: string } = {
    required: 'Este campo es requerido',
    email: 'El correo no es válido',
    minlength: 'Mínimo 6 caracteres'
  };

  private spanError: HTMLElement | null = null;
  private subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    // Crea el span vacío al iniciar
    this.spanError = this.renderer.createElement('span');
    this.renderer.addClass(this.spanError, 'error-msg');
    this.renderer.insertBefore(
      this.el.nativeElement.parentNode,
      this.spanError,
      this.el.nativeElement.nextSibling
    );

    this.renderer.listen(this.el.nativeElement, 'blur', () => {
      this.control.control?.markAsTouched();
      this.updateUI();
    });

    const sub = this.control.statusChanges?.subscribe(() => {
      if (this.control.touched) this.updateUI();
    });

    if (sub) this.subscription.add(sub);
  }

  private updateUI(): void {
    const isInvalidAndTouched = this.control.invalid && this.control.touched;

    if (isInvalidAndTouched) {
      this.renderer.addClass(this.el.nativeElement, 'input-error');
      const errors = this.control.errors;
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        this.renderer.setProperty(
          this.spanError,
          'textContent',
          this.messages[firstKey] ?? 'Campo inválido'
        );
      }
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'input-error');
      this.renderer.setProperty(this.spanError, 'textContent', '');
    }
  }

  private removeErrorSpan(): void {
    if (this.spanError) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.spanError);
      this.spanError = null;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.removeErrorSpan();
  }
}
