import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { FinancialProductService } from '../../services/financial-product.service';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  productForm: FormGroup;
  today: Date = new Date();

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
      // Procesar el formulario
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onReset() {
    this.productForm.reset();
  }

  get f() { return this.productForm.controls; }
}
