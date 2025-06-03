import { Component, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialProduct } from '../../../../core/models/financial-product.model';
import { NgIf } from '@angular/common';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { FinancialProductService } from '../../services/financial-product.service';

@Component({
  selector: 'app-product-dropdown',
  standalone: true,
  imports: [NgIf, ModalDeleteComponent],
  templateUrl: './product-dropdown.component.html',
  styleUrl: './product-dropdown.component.scss'
})
export class ProductDropdownComponent {
  @Input() product!: FinancialProduct;
  showMenu = false;
  showDeleteModal = false;
  deleting = false;
  error: string | null = null;

  constructor(private router: Router, private productService: FinancialProductService) {}

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  editProduct() {
    this.router.navigate(['/edit', this.product.id]);
    this.showMenu = false;
  }

  deleteProduct() {
    this.showDeleteModal = true;
    this.showMenu = false;
  }

  onCancelDelete() {
    this.showDeleteModal = false;
  }

  onConfirmDelete() {
    this.deleting = true;
    this.productService.deleteProduct(this.product.id).subscribe({
      next: () => {
        this.deleting = false;
        this.showDeleteModal = false;
        window.location.reload(); // Recargar la lista tras eliminar
      },
      error: (err) => {
        this.error = err.message || 'Error al eliminar el producto';
        this.deleting = false;
      }
    });
  }

  @HostListener('document:click')
  closeMenu() {
    this.showMenu = false;
  }
}
