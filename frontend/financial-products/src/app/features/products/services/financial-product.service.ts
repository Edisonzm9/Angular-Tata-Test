import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { FinancialProduct } from '../../../core/models/financial-product.model';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductService {
  private readonly API_URL = environment.api.products;

  constructor(private http: HttpClient) { }

  getAll(): Observable<FinancialProduct[]> {
    return this.http.get<{ data: FinancialProduct[] }>(this.API_URL)
      .pipe(
        map(resp => resp.data),
        catchError((error) => {
          if (error.status === 400) {
            return throwError(() => ({
              message: error.error?.message || 'Solicitud inválida.',
              status: 400,
              errors: error.error?.errors || null
            }));
          } else if (error.status === 404) {
            return throwError(() => ({
              message: 'No se encontraron productos.',
              status: 404
            }));
          } else {
            return throwError(() => ({
              message: 'Error inesperado al obtener productos.',
              status: error.status || 500
            }));
          }
        })
      );
  }

  createProduct(product: FinancialProduct): Observable<any> {
    return this.http.post(this.API_URL, product).pipe(
      map((resp: any) => resp),
      catchError((error) => {
        if (error.status === 400) {
          return throwError(() => ({
            message: error.error?.message || 'Solicitud inválida. Verifique los datos.',
            status: 400,
            errors: error.error?.errors || null
          }));
        } else if (error.status === 404) {
          return throwError(() => ({
            message: 'No se encontró el recurso solicitado.',
            status: 404
          }));
        } else {
          return throwError(() => ({
            message: 'Error inesperado en el servidor.',
            status: error.status || 500
          }));
        }
      })
    );
  }

  getById(id: string): Observable<FinancialProduct> {
    return this.http.get<any>(`${this.API_URL}/${id}`)
      .pipe(
        map(resp => resp.data ? resp.data : resp),
        catchError((error) => {
          if (error.status === 404) {
            return throwError(() => ({
              message: 'Producto no encontrado.',
              status: 404
            }));
          } else {
            return throwError(() => ({
              message: 'Error inesperado al obtener el producto.',
              status: error.status || 500
            }));
          }
        })
      );
  }

  updateProduct(id: string, product: FinancialProduct): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, product).pipe(
      map((resp: any) => resp),
      catchError((error) => {
        if (error.status === 400) {
          return throwError(() => ({
            message: error.error?.message || 'Solicitud inválida. Verifique los datos.',
            status: 400,
            errors: error.error?.errors || null
          }));
        } else if (error.status === 404) {
          return throwError(() => ({
            message: 'No se encontró el recurso solicitado.',
            status: 404
          }));
        } else {
          return throwError(() => ({
            message: 'Error inesperado en el servidor.',
            status: error.status || 500
          }));
        }
      })
    );
  }

  // financial-product.service.ts
  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`/bp/products/verification/${id}`);
  }


  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      map((resp: any) => resp),
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => ({
            message: 'No se encontró el producto.',
            status: 404
          }));
        } else {
          return throwError(() => ({
            message: 'Error inesperado al eliminar el producto.',
            status: error.status || 500
          }));
        }
      })
    );
  }
}