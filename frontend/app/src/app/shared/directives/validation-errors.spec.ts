import { ValidationErrorsDirective } from './validation-errors';
import { ElementRef, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

describe('ValidationErrorsDirective', () => {
  it('should create an instance', () => {
    const elRef = { nativeElement: document.createElement('input') } as ElementRef;
    const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', [
      'createElement', 'addClass', 'removeClass', 'insertBefore', 'removeChild',
      'setProperty', 'listen'
    ]);
    const control = jasmine.createSpyObj<NgControl>('NgControl', [], {
      statusChanges: undefined,
      control: null,
      invalid: false,
      touched: false,
      errors: null
    });

    const directive = new ValidationErrorsDirective(elRef, renderer, control);
    expect(directive).toBeTruthy();
  });
});
