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
  allProducts: FinancialProduct[] = [];
  displayedProducts: FinancialProduct[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  pageSize: number = 5;

  constructor(private productService: FinancialProductService) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.updateDisplayedProducts();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.trim();
    this.updateDisplayedProducts();
  }

  onPageSizeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = +value;
    this.updateDisplayedProducts();
  }

  private updateDisplayedProducts(): void {
    const lowerTerm = this.searchTerm.toLowerCase();
    const filtered = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerTerm) ||
      product.description.toLowerCase().includes(lowerTerm)
    );
    this.displayedProducts = filtered.slice(0, this.pageSize);
  }
}

