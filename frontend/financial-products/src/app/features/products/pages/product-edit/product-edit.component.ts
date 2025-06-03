import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialProductService } from '../../services/financial-product.service';
import { CommonModule } from '@angular/common';
import { FinancialProduct } from '../../../../core/models/financial-product.model';

/**
 * Componente para la edición de productos financieros.
 * 
 * Permite cargar, validar y actualizar la información de un producto financiero existente.
 */
@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  /**
   * Formulario reactivo para la edición del producto.
   */
  productForm: FormGroup;

  /**
   * Indica si se está realizando una operación de carga o guardado.
   */
  loading = false;

  /**
   * Mensaje de éxito tras actualizar el producto.
   */
  successMessage: string | null = null;

  /**
   * Mensaje de error en caso de fallo al cargar o actualizar.
   */
  errorMessage: string | null = null;

  /**
   * Inyecta servicios para formularios, rutas, navegación y operaciones de producto.
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: FinancialProductService
  ) {
    // Inicializa el formulario con validaciones personalizadas y estándar.
    this.productForm = this.fb.group({
      id: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.dateReleaseValidator()]],
      date_revision: ['', [Validators.required, this.dateRevisionValidator()]]
    });
  }

  /**
   * Carga los datos del producto a editar al inicializar el componente.
   */
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

  /**
   * Validador personalizado para la fecha de lanzamiento.
   * Valida que la fecha no sea anterior a hoy.
   */
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

  /**
   * Validador personalizado para la fecha de revisión.
   * Valida que la fecha de revisión sea exactamente un año después de la fecha de lanzamiento.
   */
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

  /**
   * Envía el formulario si es válido, actualiza el producto y gestiona los mensajes de estado.
   */
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

  /**
   * Formatea una fecha a formato yyyy-MM-dd.
   * @param date Fecha a formatear.
   * @returns Fecha en formato yyyy-MM-dd.
   */
  formatDate(date: string): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  /**
   * Resetea el formulario a su estado inicial.
   */
  onReset() {
    this.productForm.reset();
  }

  /**
   * Acceso rápido a los controles del formulario para facilitar la validación en la vista.
   */
  get f() { return this.productForm.controls; }
}
