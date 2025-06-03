import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDropdownComponent } from './product-dropdown.component';
import { FinancialProduct } from '../../../../core/models/financial-product.model';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FinancialProductService } from '../../services/financial-product.service';
import { By } from '@angular/platform-browser';

const mockRouter = { navigate: jest.fn() };
const mockFinancialProductService = {
  deleteProduct: jest.fn().mockReturnValue(of({ message: 'Producto eliminado exitosamente.' }))
};

describe('ProductDropdownComponent', () => {
  let component: ProductDropdownComponent;
  let fixture: ComponentFixture<ProductDropdownComponent>;

  const mockProduct: FinancialProduct = {
    id: '1',
    name: 'Producto Test',
    description: 'Descripción de prueba',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDropdownComponent, ModalDeleteComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: FinancialProductService, useValue: mockFinancialProductService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProductDropdownComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el menú al hacer click en el botón', () => {
    component.toggleMenu(new MouseEvent('click'));
    expect(component.showMenu).toBeTruthy();
  });

  it('debe ocultar el menú al llamar closeMenu()', () => {
    component.showMenu = true;
    component.closeMenu();
    expect(component.showMenu).toBeFalsy();
  });

  it('debe navegar al editar producto y cerrar el menú', () => {
    const spy = jest.spyOn(mockRouter, 'navigate');
    component.showMenu = true;
    component.editProduct();
    expect(spy).toHaveBeenCalledWith(['/edit', mockProduct.id]);
    expect(component.showMenu).toBeFalsy();
  });

  it('debe mostrar el modal de eliminar al llamar deleteProduct()', () => {
    component.deleteProduct();
    expect(component.showDeleteModal).toBeTruthy();
    expect(component.showMenu).toBeFalsy();
  });

  it('debe ocultar el modal al cancelar', () => {
    component.showDeleteModal = true;
    component.onCancelDelete();
    expect(component.showDeleteModal).toBeFalsy();
  });

  it('debe llamar deleteProduct del servicio y recargar al confirmar', () => {

    const originalLocation = window.location;

    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { ...originalLocation, reload: jest.fn() };

    // --- tu test ---
    component.deleting = false;
    component.showDeleteModal = true;
    component.onConfirmDelete();

    expect(component.deleting).toBe(false);
    expect(component.showDeleteModal).toBe(false);
    expect(mockFinancialProductService.deleteProduct).toHaveBeenCalledWith('1');
    expect(window.location.reload).toHaveBeenCalled();

    // Restaura el window.location original después del test
    window.location = originalLocation;
  });


  it('debe mostrar error al eliminar si hay error', () => {
    mockFinancialProductService.deleteProduct.mockReturnValueOnce(
      throwError(() => ({ message: 'Error al eliminar el producto' }))
    );
    component.onConfirmDelete();
    expect(component.error).toBe('Error al eliminar el producto');
    expect(component.deleting).toBe(false);
  });

  it('debe evitar error si el error no tiene message', () => {
    mockFinancialProductService.deleteProduct.mockReturnValueOnce(
      throwError(() => ({}))
    );
    component.onConfirmDelete();
    expect(component.error).toBe('Error al eliminar el producto');
    expect(component.deleting).toBe(false);
  });
});
