import { Component, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialProduct } from '../../../../core/models/financial-product.model';
import { NgIf } from '@angular/common';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { FinancialProductService } from '../../services/financial-product.service';

/**
 * Componente para mostrar un menú desplegable de acciones sobre un producto financiero.
 * 
 * Permite editar o eliminar el producto seleccionado, mostrando un modal de confirmación para la eliminación.
 */
@Component({
  selector: 'app-product-dropdown',
  standalone: true,
  imports: [NgIf, ModalDeleteComponent],
  templateUrl: './product-dropdown.component.html',
  styleUrl: './product-dropdown.component.scss'
})
export class ProductDropdownComponent {
  /**
   * Producto financiero sobre el que se aplican las acciones del menú.
   */
  @Input() product!: FinancialProduct;

  /**
   * Controla la visibilidad del menú desplegable.
   */
  showMenu = false;

  /**
   * Controla la visibilidad del modal de confirmación de eliminación.
   */
  showDeleteModal = false;

  /**
   * Indica si se está realizando la operación de eliminación.
   */
  deleting = false;

  /**
   * Mensaje de error en caso de fallo al eliminar.
   */
  error: string | null = null;

  /**
   * Inyecta el router para navegación y el servicio de productos para operaciones CRUD.
   */
  constructor(private router: Router, private productService: FinancialProductService) {}

  /**
   * Alterna la visibilidad del menú desplegable.
   * Detiene la propagación del evento para evitar cierres accidentales.
   */
  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  /**
   * Navega a la pantalla de edición del producto y cierra el menú.
   */
  editProduct() {
    this.router.navigate(['/edit', this.product.id]);
    this.showMenu = false;
  }

  /**
   * Muestra el modal de confirmación para eliminar el producto y cierra el menú.
   */
  deleteProduct() {
    this.showDeleteModal = true;
    this.showMenu = false;
  }

  /**
   * Cierra el modal de confirmación de eliminación.
   */
  onCancelDelete() {
    this.showDeleteModal = false;
  }

  /**
   * Confirma la eliminación del producto, llama al servicio y gestiona el estado y errores.
   */
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

  /**
   * Cierra el menú desplegable al hacer clic fuera del componente.
   */
  @HostListener('document:click')
  closeMenu() {
    this.showMenu = false;
  }
}
