import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/pages/product-list/product-list.component';
import { ProductFormComponent } from './features/products/pages/product-form/product-form.component';
import { ProductEditComponent } from './features/products/pages/product-edit/product-edit.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'new', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductEditComponent }
];
