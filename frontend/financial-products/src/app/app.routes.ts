import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/pages/product-list/product-list.component';

/**
 * Definición de rutas principales de la aplicación Financial Products con lazy loading para formularios.
 */
export const routes: Routes = [
  { path: '', component: ProductListComponent },
  {
    path: 'new',
    loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./features/products/pages/product-edit/product-edit.component').then(m => m.ProductEditComponent)
  }
];
