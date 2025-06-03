import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { FinancialProductService } from '../../services/financial-product.service';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  productForm: FormGroup;
  today: Date = new Date();
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private productService: FinancialProductService) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idExistsValidator()]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.dateReleaseValidator()]],
      date_revision: ['', [Validators.required, this.dateRevisionValidator()]]
    });
  }

  // Validador asíncrono para verificar si el ID ya existe
  idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length < 3) {
        return of(null);
      }
      return this.productService.getAll().pipe(
        map(products => products.some(p => p.id === control.value)),
        map(exists => (exists ? { idExists: true } : null)),
        catchError(() => of(null)),
        first()
      );
    };
  }

  // Validador para fecha de liberación >= hoy
  dateReleaseValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (inputDate < today) {
        return { dateReleaseInvalid: true };
      }
      return null;
    };
  }

  // Validador para fecha de revisión = fecha de liberación + 1 año
  dateRevisionValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      const release = control.parent.get('date_release')?.value;
      const revision = control.value;
      if (!release || !revision) return null;
      const releaseDate = new Date(release);
      const revisionDate = new Date(revision);
      const expectedRevision = new Date(releaseDate);
      expectedRevision.setFullYear(releaseDate.getFullYear() + 1);
      if (
        revisionDate.getDate() !== expectedRevision.getDate() ||
        revisionDate.getMonth() !== expectedRevision.getMonth() ||
        revisionDate.getFullYear() !== expectedRevision.getFullYear()
      ) {
        return { dateRevisionInvalid: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;
      this.successMessage = null;
      this.errorMessage = null;
      const formValue = { ...this.productForm.value };
      // Formatear fechas a yyyy-MM-dd
      formValue.date_release = this.formatDate(formValue.date_release);
      formValue.date_revision = this.formatDate(formValue.date_revision);
      this.productService.createProduct(formValue).subscribe({
        next: (resp) => {
          this.successMessage = 'Producto agregado exitosamente.';
          this.loading = false;
          this.productForm.reset();
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = err.message;
            // Si hay errores de validación específicos, puedes mostrarlos aquí
            if (err.errors) {
              this.errorMessage += ': ' + Object.values(err.errors).join(' ');
            }
          } else if (err.status === 404) {
            this.errorMessage = 'No se encontró el recurso solicitado.';
          } else {
            this.errorMessage = 'Error inesperado en el servidor.';
          }
          this.loading = false;
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onReset() {
    this.productForm.reset();
  }

  get f() { return this.productForm.controls; }
}
