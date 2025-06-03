import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { FinancialProduct } from '../../../core/models/financial-product.model';
import { environment } from '../../../../environments/environment.prod';

/**
 * Servicio para gestionar operaciones CRUD de productos financieros.
 *
 * Centraliza la comunicación con la API y el manejo de errores para las operaciones sobre productos.
 */
@Injectable({
  providedIn: 'root'
})
export class FinancialProductService {
  /**
   * URL base de la API para productos financieros.
   */
  private readonly API_URL = environment.api.products;

  /**
   * Inyecta el cliente HTTP para realizar peticiones a la API.
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los productos financieros.
   * @returns Observable con la lista de productos.
   */
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

  /**
   * Crea un nuevo producto financiero.
   * @param product Producto a crear.
   * @returns Observable con la respuesta de la API.
   */
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

  /**
   * Obtiene un producto financiero por su ID.
   * @param id Identificador del producto.
   * @returns Observable con el producto encontrado.
   */
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

  /**
   * Actualiza un producto financiero existente.
   * @param id Identificador del producto.
   * @param product Datos actualizados del producto.
   * @returns Observable con la respuesta de la API.
   */
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

  /**
   * Verifica si un ID de producto ya existe en la base de datos.
   * @param id ID a verificar.
   * @returns Observable que emite true si el ID existe, false en caso contrario.
   */
  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`/bp/products/verification/${id}`);
  }

  /**
   * Elimina un producto financiero por su ID.
   * @param id Identificador del producto a eliminar.
   * @returns Observable con la respuesta de la API.
   */
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