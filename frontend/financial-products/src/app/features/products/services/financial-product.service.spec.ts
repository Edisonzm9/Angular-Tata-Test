import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinancialProductService } from './financial-product.service';
import { FinancialProduct } from '../../../core/models/financial-product.model';

describe('FinancialProductService', () => {
  let service: FinancialProductService;
  let httpMock: HttpTestingController;
  const mockUrl = 'http://localhost:3002/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancialProductService]
    });
    service = TestBed.inject(FinancialProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener todos los productos', () => {
    const mockProducts: FinancialProduct[] = [
      { id: '1', name: 'Producto 1', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
    ];
    service.getAll().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
    const req = httpMock.expectOne(service['API_URL']);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('debe manejar error 404 al obtener productos', () => {
    service.getAll().subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(404);
        expect(err.message).toBe('No se encontraron productos.');
      }
    });
    const req = httpMock.expectOne(service['API_URL']);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('debe crear un producto', () => {
    const newProduct: FinancialProduct = { id: '2', name: 'Nuevo', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.createProduct(newProduct).subscribe(resp => {
      expect(resp).toBeTruthy();
    });
    const req = httpMock.expectOne(service['API_URL']);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Product added successfully', data: newProduct });
  });

  it('debe obtener un producto por id', () => {
    const product: FinancialProduct = { id: '1', name: 'Producto 1', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.getById('1').subscribe(resp => {
      expect(resp).toEqual(product);
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: product });
  });

  it('debe actualizar un producto', () => {
    const product: FinancialProduct = { id: '1', name: 'Actualizado', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.updateProduct('1', product).subscribe(resp => {
      expect(resp).toBeTruthy();
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Product updated successfully', data: product });
  });

  it('debe eliminar un producto', () => {
    service.deleteProduct('1').subscribe(resp => {
      expect(resp).toBeTruthy();
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });
  });
});