import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { FinancialProductService } from '../../services/financial-product.service';
import { of, throwError } from 'rxjs';
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

  // it('debe mostrar error si el id ya existe (validador asíncrono)', fakeAsync(() => {
  //   productServiceMock.verifyId.mockReturnValue(of(true)); // Simula que el ID existe
  //   const idControl = component.productForm.get('id');
  //   idControl?.setValue('1');
  //   idControl?.markAsTouched();
  //   idControl?.markAsDirty();
  //   idControl?.updateValueAndValidity({ onlySelf: true, emitEvent: true });
  //   // ¡Espera suficiente y luego flush!
  //   tick(1000);
  //   flush();
  //   fixture.detectChanges();
  //   expect(idControl?.hasError('idExists')).toBeTruthy();
  // }));

  it('debe mostrar error si la fecha de liberación es menor a hoy', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    component.productForm.get('date_release')?.setValue(pastDate.toISOString().substring(0, 10));
    fixture.detectChanges();
    expect(component.productForm.get('date_release')?.hasError('dateReleaseInvalid')).toBeTruthy();
  });

  it('debe mostrar error si la fecha de revisión no es un año después de la de liberación', () => {
    component.productForm.get('date_release')?.setValue('2025-01-01');
    component.productForm.get('date_revision')?.setValue('2025-01-01');
    fixture.detectChanges();
    expect(component.productForm.get('date_revision')?.hasError('dateRevisionInvalid')).toBeTruthy();
  });

  // it('debe enviar el formulario correctamente si es válido', fakeAsync(() => {
  //   fillForm();
  //   productServiceMock.createProduct.mockReturnValue(of({ message: 'Producto agregado exitosamente.' }));
  //   component.onSubmit();
  //   tick(); fixture.detectChanges();
  //   flush();
  //   expect(component.successMessage).toBe('Producto agregado exitosamente.');
  //   expect(component.errorMessage).toBeNull();
  //   expect(productServiceMock.createProduct).toHaveBeenCalled();
  // }));

  // it('debe mostrar mensaje de error si el servicio retorna error 400', fakeAsync(() => {
  //   fillForm();
  //   productServiceMock.createProduct.mockReturnValue(throwError(() => ({ status: 400, message: 'Solicitud inválida. Verifique los datos.' })));
  //   component.onSubmit();
  //   tick(); fixture.detectChanges();
  //   flush();
  //   expect(component.errorMessage).toContain('Solicitud inválida. Verifique los datos.');
  // }));

  // it('debe mostrar mensaje de error si el servicio retorna error 404', fakeAsync(() => {
  //   fillForm();
  //   productServiceMock.createProduct.mockReturnValue(throwError(() => ({ status: 404, message: 'No se encontró el recurso solicitado.' })));
  //   component.onSubmit();
  //   tick(); fixture.detectChanges();
  //   flush();
  //   expect(component.errorMessage).toContain('No se encontró el recurso solicitado.');
  // }));

  // it('debe mostrar mensaje de error si el servicio retorna error 500', fakeAsync(() => {
  //   fillForm();
  //   productServiceMock.createProduct.mockReturnValue(throwError(() => ({ status: 500, message: 'Error inesperado en el servidor.' })));
  //   component.onSubmit();
  //   tick(); fixture.detectChanges();
  //   flush();
  //   expect(component.errorMessage).toContain('Error inesperado en el servidor.');
  // }));

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
