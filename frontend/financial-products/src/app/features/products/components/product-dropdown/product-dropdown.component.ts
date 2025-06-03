import { Component, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialProduct } from '../../../../core/models/financial-product.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product-dropdown',
  standalone: true,
  imports: [NgIf],
  templateUrl: './product-dropdown.component.html',
  styleUrl: './product-dropdown.component.scss'
})
export class ProductDropdownComponent {
  @Input() product!: FinancialProduct;
  showMenu = false;

  constructor(private router: Router) {}

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  editProduct() {
    this.router.navigate(['/edit', this.product.id]);
    this.showMenu = false;
  }

  @HostListener('document:click')
  closeMenu() {
    this.showMenu = false;
  }
}
