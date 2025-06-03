import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { FinancialProductService } from '../../services/financial-product.service';
import { of, throwError } from 'rxjs';
import { FinancialProduct } from '../../../../core/models/financial-product.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductDropdownComponent } from '../../components/product-dropdown/product-dropdown.component';

const mockProducts: FinancialProduct[] = [
  {
    id: '1',
    name: 'Tarjeta Verde Lima',
    description: 'Producto con logo verde lima',
    logo: '',
    date_release: '2025-03-01',
    date_revision: '2026-03-01'
  },
  {
    id: '2',
    name: 'Tarjeta Celeste',
    description: 'Producto con logo celeste',
    logo: '',
    date_release: '2025-05-01',
    date_revision: '2026-05-01'
  }
];

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: { getAll: jest.Mock };

  beforeEach(async () => {
    productServiceSpy = { getAll: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterTestingModule, ProductDropdownComponent],
      providers: [
        { provide: FinancialProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();
  });

  function createComponentWithProducts(products = mockProducts) {
    productServiceSpy.getAll.mockReturnValue(of(products));
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('debe crear el componente', () => {
    createComponentWithProducts();
    expect(component).toBeTruthy();
  });

  it('debe cargar productos al inicializar', () => {
    createComponentWithProducts();
    expect(component.allProducts.length).toBe(2);
    expect(component.displayedProducts.length).toBe(2);
    expect(component.loading).toBeFalsy();
  });

  it('debe mostrar mensaje de error si falla el servicio', () => {
    productServiceSpy.getAll.mockReturnValue(throwError(() => ({ message: 'Error al cargar los productos' })));
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.error).toBe('Error al cargar los productos');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Error al cargar los productos');
  });

  it('debe filtrar productos por búsqueda', () => {
    createComponentWithProducts();
    component.onSearch('Celeste');
    expect(component.displayedProducts.length).toBe(1);
    expect(component.displayedProducts[0].name).toContain('Celeste');
  });

  it('debe mostrar mensaje "Sin resultados" si la búsqueda no encuentra productos', () => {
    createComponentWithProducts();
    component.onSearch('NoExiste');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sin resultados');
  });

  it('debe paginar los productos según el pageSize', () => {
    createComponentWithProducts([...mockProducts, {...mockProducts[0], id: '3', name: 'Otro'}]);
    component.onPageSizeChange({ target: { value: '2' } } as any);
    expect(component.pageSize).toBe(2);
    expect(component.displayedProducts.length).toBe(2);
  });

  it('debe mostrar el texto correcto de cantidad de resultados', () => {
    createComponentWithProducts();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('2 resultados');
    component.onSearch('Celeste');
    fixture.detectChanges();
    expect(compiled.textContent).toContain('1 resultado');
    component.onSearch('NoExiste');
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Sin resultados');
  });

  it('debe filtrar productos al escribir en el input de búsqueda', () => {
    createComponentWithProducts();
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="text"]');
    input.value = 'Celeste';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.displayedProducts.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Tarjeta Celeste');
  });

  it('debe cambiar el pageSize al seleccionar otro valor en el select', () => {
    createComponentWithProducts([...mockProducts, {...mockProducts[0], id: '3', name: 'Otro'}]);
    component.onPageSizeChange({ target: { value: '2' } } as any);
    expect(component.pageSize).toBe(2);
    expect(component.displayedProducts.length).toBe(2);
  });

  it('debe renderizar una fila por cada producto mostrado', () => {
    createComponentWithProducts();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // Si hay productos, no debe estar el mensaje de "Sin resultados"
    expect(rows.length).toBe(mockProducts.length);
    expect(fixture.nativeElement.textContent).toContain('Tarjeta Verde Lima');
    expect(fixture.nativeElement.textContent).toContain('Tarjeta Celeste');
  });

  it('debe mostrar el mensaje "Sin resultados" en el DOM cuando no hay productos', () => {
    createComponentWithProducts([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sin resultados');
  });
}); 