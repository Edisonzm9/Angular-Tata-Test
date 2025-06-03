import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDropdownComponent } from './product-dropdown.component';
import { FinancialProduct } from '../../../../core/models/financial-product.model';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FinancialProductService } from '../../services/financial-product.service';

// Mocks posibles para Router
const mockRouter = {
  navigate: () => {},
  navigateByUrl: () => {},
  url: '/',
  events: of([]),
  createUrlTree: () => ({}),
  serializeUrl: () => '',
  resetConfig: () => {},
  isActive: () => false,
  getCurrentNavigation: () => null,
  routerState: {},
  config: [],
  errorHandler: () => {},
  dispose: () => {},
  onSameUrlNavigation: 'reload',
  initialNavigation: () => {},
  setUpLocationChangeListener: () => {}
};

// Mocks posibles para FinancialProductService
const mockFinancialProductService = {
  getById: () => of({}),
  updateProduct: () => of({}),
  getAll: () => of([]),
  createProduct: () => of({}),
  verifyId: () => of(false),
  deleteProduct: () => of({ message: 'Producto eliminado exitosamente.' }),
  // Métodos no relevantes
  someUnusedMethod: () => of(null),
  anotherHelperMethod: () => {},
  extraSyncMethod: () => true,
  extraAsyncMethod: () => Promise.resolve('ok'),
  extraObservableMethod: () => of('extra')
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
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Test simple de renderizado de menú
  it('debe mostrar el menú al hacer click en el botón', () => {
    component.toggleMenu(new MouseEvent('click'));
    expect(component.showMenu).toBeTruthy();
  });

  // Test simple de abrir modal de eliminar
  it('debe mostrar el modal de eliminar al llamar deleteProduct()', () => {
    component.deleteProduct();
    expect(component.showDeleteModal).toBeTruthy();
  });
});
