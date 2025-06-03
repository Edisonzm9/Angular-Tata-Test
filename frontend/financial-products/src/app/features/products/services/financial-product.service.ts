import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FinancialProduct } from '../../../core/models/financial-product.model';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductService {
  private readonly API_URL = environment.api.products;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FinancialProduct[]> {
    return this.http.get<{ data: FinancialProduct[] }>(this.API_URL)
      .pipe(map(resp => resp.data));
  }
}