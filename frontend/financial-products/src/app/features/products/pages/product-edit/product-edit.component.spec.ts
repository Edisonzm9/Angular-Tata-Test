import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductEditComponent } from './product-edit.component';
import { FinancialProductService } from '../../services/financial-product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

const mockProduct = {
  id: '1',
  name: 'Producto Editado',
  description: 'Descripción válida para producto',
  logo: 'logo.png',
  date_release: '2025-01-01',
  date_revision: '2026-01-01'
};

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let productServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getById: () => of(mockProduct),
      updateProduct: jest.fn(() => of({ message: 'Producto actualizado exitosamente.' })),
      getAll: jest.fn(() => of([mockProduct])),
      createProduct: jest.fn(() => of({ message: 'Producto creado exitosamente.' })),
      verifyId: jest.fn(() => of(false)),
      deleteProduct: jest.fn(() => of({ message: 'Producto eliminado exitosamente.' }))
    };
    routerMock = {
      navigate: jest.fn()
    };
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'id' ? '1' : null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProductEditComponent, ReactiveFormsModule],
      providers: [
        { provide: FinancialProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fillForm(valid = true) {
    component.productForm.setValue({
      id: valid ? '1' : '',
      name: valid ? 'Producto Editado' : '',
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
    expect(component.productForm.getRawValue()).toEqual({
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

  it('debe marcar error en date_release si es menor a hoy', () => {
    fillForm();
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1); // ayer
    component.productForm.get('date_release')?.setValue(hoy.toISOString().slice(0, 10));
    component.productForm.get('date_release')?.updateValueAndValidity();
    expect(component.productForm.get('date_release')?.errors).toEqual({ dateReleaseInvalid: true });
  });


  it('debe marcar error en date_revision si no es un año después de date_release', () => {
    fillForm();
    // date_release: 2025-01-01, ponemos date_revision: 2025-01-01
    component.productForm.get('date_revision')?.setValue('2025-01-01');
    component.productForm.get('date_revision')?.updateValueAndValidity();
    expect(component.productForm.get('date_revision')?.errors).toEqual({ dateRevisionInvalid: true });
  });

});

