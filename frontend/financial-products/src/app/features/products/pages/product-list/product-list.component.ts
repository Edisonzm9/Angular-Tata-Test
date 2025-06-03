import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FinancialProductService } from '../../services/financial-product.service';
import { FinancialProduct } from '../../../../core/models/financial-product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: FinancialProduct[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productService: FinancialProductService) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }
}
