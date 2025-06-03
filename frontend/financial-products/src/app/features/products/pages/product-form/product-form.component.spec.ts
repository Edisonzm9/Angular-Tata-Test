import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { FinancialProductService } from '../../services/financial-product.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceMock: {
    getAll: jest.Mock,
    createProduct: jest.Mock,
    verifyId: jest.Mock
  };

  beforeEach(async () => {
    productServiceMock = {
      getAll: jest.fn().mockReturnValue(of([])),
      createProduct: jest.fn(),
      verifyId: jest.fn().mockReturnValue(of(false))
    };
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        { provide: FinancialProductService, useValue: productServiceMock }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fillForm(valid = true) {
    component.productForm.setValue({
      id: valid ? 'nuevo' : '',
      name: valid ? 'Producto Nuevo' : '',
      description: valid ? 'Descripción válida para producto' : '',
      logo: valid ? 'logo.png' : '',
      date_release: valid ? '2025-01-01' : '',
      date_revision: valid ? '2026-01-01' : ''
    });
    component.productForm.get('date_release')?.updateValueAndValidity();
    component.productForm.get('date_revision')?.updateValueAndValidity();
  }

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar errores de validación si el formulario es inválido', () => {
    fillForm(false);
    component.onSubmit();
    fixture.detectChanges();
    expect(component.productForm.invalid).toBeTruthy();
  });

  it('debe resetear el formulario al hacer click en Reiniciar', () => {
    fillForm();
    component.onReset();
    expect(component.productForm.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null
    });
  });

  it('debe dejar el formulario inválido si faltan campos', () => {
    fillForm(false);
    expect(component.productForm.valid).toBeFalsy();
  });


  it('debe mostrar error si la fecha de liberación es menor a hoy', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    component.productForm.get('date_release')?.setValue(pastDate.toISOString().substring(0, 10));
    component.productForm.get('date_release')?.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.productForm.get('date_release')?.hasError('dateReleaseInvalid')).toBeTruthy();
  });


  it('debe mostrar error si la fecha de revisión no es un año después de la de liberación', () => {
    component.productForm.get('date_release')?.setValue('2025-01-01');
    component.productForm.get('date_revision')?.setValue('2025-01-01');
    component.productForm.get('date_revision')?.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.productForm.get('date_revision')?.hasError('dateRevisionInvalid')).toBeTruthy();
  });




  it('debe deshabilitar el botón de enviar cuando loading es true', () => {
    fillForm();
    component.loading = true;
    fixture.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitBtn.nativeElement.disabled).toBeTruthy();
  });

  it('debe permitir interacción con el DOM: escribir en el input de nombre', () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[id="name"]');
    input.value = 'Nuevo Nombre';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.productForm.get('name')?.value).toBe('Nuevo Nombre');
  });


});
