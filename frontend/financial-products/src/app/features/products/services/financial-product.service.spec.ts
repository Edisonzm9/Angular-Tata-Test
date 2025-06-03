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
  // getAll: error 400 y error genérico
  it('debe manejar error 400 al obtener productos', () => {
    service.getAll().subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Solicitud inválida.');
      }
    });
    const req = httpMock.expectOne(service['API_URL']);
    req.flush({ message: 'Solicitud inválida.' }, { status: 400, statusText: 'Bad Request' });
  });

  it('debe manejar error 500 al obtener productos', () => {
    service.getAll().subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.message).toBe('Error inesperado al obtener productos.');
      }
    });
    const req = httpMock.expectOne(service['API_URL']);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  // createProduct: errores
  it('debe manejar error 400 al crear producto', () => {
    const newProduct: FinancialProduct = { id: '2', name: 'Nuevo', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.createProduct(newProduct).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Solicitud inválida. Verifique los datos.');
      }
    });
    const req = httpMock.expectOne(service['API_URL']);
    req.flush({ message: 'Solicitud inválida. Verifique los datos.' }, { status: 400, statusText: 'Bad Request' });
  });

  it('debe manejar error 404 al crear producto', () => {
    const newProduct: FinancialProduct = { id: '2', name: 'Nuevo', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.createProduct(newProduct).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(404);
        expect(err.message).toBe('No se encontró el recurso solicitado.');
      }
    });
    const req = httpMock.expectOne(service['API_URL']);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('debe manejar error 500 al crear producto', () => {
    const newProduct: FinancialProduct = { id: '2', name: 'Nuevo', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.createProduct(newProduct).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.message).toBe('Error inesperado en el servidor.');
      }
    });
    const req = httpMock.expectOne(service['API_URL']);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  // getById: error 404, error 500 y fallback map
  it('debe manejar error 404 al obtener producto por id', () => {
    service.getById('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(404);
        expect(err.message).toBe('Producto no encontrado.');
      }
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('debe manejar error 500 al obtener producto por id', () => {
    service.getById('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.message).toBe('Error inesperado al obtener el producto.');
      }
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  it('debe retornar el objeto cuando no hay campo data en getById', () => {
    const product: FinancialProduct = { id: '1', name: 'Producto 1', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.getById('1').subscribe(resp => {
      expect(resp).toEqual(product);
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush(product);
  });

  // updateProduct: errores
  it('debe manejar error 400 al actualizar producto', () => {
    const product: FinancialProduct = { id: '1', name: 'Actualizado', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.updateProduct('1', product).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Solicitud inválida. Verifique los datos.');
      }
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush({ message: 'Solicitud inválida. Verifique los datos.' }, { status: 400, statusText: 'Bad Request' });
  });

  it('debe manejar error 404 al actualizar producto', () => {
    const product: FinancialProduct = { id: '1', name: 'Actualizado', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.updateProduct('1', product).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(404);
        expect(err.message).toBe('No se encontró el recurso solicitado.');
      }
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('debe manejar error 500 al actualizar producto', () => {
    const product: FinancialProduct = { id: '1', name: 'Actualizado', description: 'Desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.updateProduct('1', product).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.message).toBe('Error inesperado en el servidor.');
      }
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  // verifyId
  it('debe verificar si el id existe', () => {
    service.verifyId('1').subscribe(exists => {
      expect(exists).toBe(true);
    });
    const req = httpMock.expectOne(`/bp/products/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('debe manejar error en verifyId', () => {
    service.verifyId('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });
    const req = httpMock.expectOne(`/bp/products/verification/1`);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  // deleteProduct
  it('debe manejar error 404 al eliminar producto', () => {
    service.deleteProduct('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(404);
        expect(err.message).toBe('No se encontró el producto.');
      }
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('debe manejar error 500 al eliminar producto', () => {
    service.deleteProduct('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.message).toBe('Error inesperado al eliminar el producto.');
      }
    });
    const req = httpMock.expectOne(`${service['API_URL']}/1`);
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

});