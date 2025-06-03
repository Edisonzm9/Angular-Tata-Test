import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FinancialProductService } from '../../services/financial-product.service';
import { FinancialProduct } from '../../../../core/models/financial-product.model';
import { ProductDropdownComponent } from '../../components/product-dropdown/product-dropdown.component';

/**
 * Componente para mostrar la lista de productos financieros.
 *
 * Permite buscar, paginar y visualizar productos, integrando el menú de acciones para cada producto.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterModule, ProductDropdownComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  /**
   * Todos los productos obtenidos del backend.
   */
  allProducts: FinancialProduct[] = [];

  /**
   * Productos actualmente mostrados según búsqueda y paginación.
   */
  displayedProducts: FinancialProduct[] = [];

  /**
   * Indica si se están cargando los productos.
   */
  loading = false;

  /**
   * Mensaje de error en caso de fallo al cargar los productos.
   */
  error: string | null = null;

  /**
   * Término de búsqueda actual.
   */
  searchTerm: string = '';

  /**
   * Cantidad de productos a mostrar por página.
   */
  pageSize: number = 5;

  /**
   * Inyecta el servicio de productos financieros.
   */
  constructor(private productService: FinancialProductService) {}

  /**
   * Carga todos los productos al inicializar el componente.
   */
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

  /**
   * Actualiza el término de búsqueda y filtra los productos mostrados.
   * @param term Término de búsqueda ingresado por el usuario.
   */
  onSearch(term: string): void {
    this.searchTerm = term.trim();
    this.updateDisplayedProducts();
  }

  /**
   * Cambia la cantidad de productos mostrados por página.
   * @param event Evento del selector de cantidad.
   */
  onPageSizeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = +value;
    this.updateDisplayedProducts();
  }

  /**
   * Filtra y pagina los productos según el término de búsqueda y el tamaño de página.
   */
  private updateDisplayedProducts(): void {
    const lowerTerm = this.searchTerm.toLowerCase();
    const filtered = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerTerm) ||
      product.description.toLowerCase().includes(lowerTerm)
    );
    this.displayedProducts = filtered.slice(0, this.pageSize);
  }
}

