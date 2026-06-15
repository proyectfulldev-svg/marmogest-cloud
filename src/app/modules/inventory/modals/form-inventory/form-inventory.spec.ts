import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInventory } from './form-inventory';

describe('FormInventory', () => {
  let component: FormInventory;
  let fixture: ComponentFixture<FormInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInventory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
