import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialProductService } from '../../services/financial-product.service';
import { CommonModule } from '@angular/common';
import { FinancialProduct } from '../../../../core/models/financial-product.model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: FinancialProductService
  ) {
    this.productForm = this.fb.group({
      id: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.dateReleaseValidator()]],
      date_revision: ['', [Validators.required, this.dateRevisionValidator()]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.productService.getById(id).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.productForm.get('id')?.setValue(product.id, { emitEvent: false });
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al cargar el producto.';
          this.loading = false;
        }
      });
    }
  }

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
      const formValue = { ...this.productForm.getRawValue() };
      formValue.date_release = this.formatDate(formValue.date_release);
      formValue.date_revision = this.formatDate(formValue.date_revision);
      this.productService.updateProduct(formValue.id, formValue).subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado exitosamente.';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/']), 1500);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = err.message;
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
