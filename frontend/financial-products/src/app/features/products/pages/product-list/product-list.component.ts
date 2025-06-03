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
  allProducts: FinancialProduct[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';

  constructor(private productService: FinancialProductService) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.allProducts = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    const lowerTerm = term.toLowerCase();
    this.products = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerTerm) ||
      product.description.toLowerCase().includes(lowerTerm)
    );
  }
}
