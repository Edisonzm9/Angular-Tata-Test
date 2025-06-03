import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { FinancialProductService } from '../../services/financial-product.service';
import { Observable, of } from 'rxjs';
import { map, catchError, first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

/**
 * Componente para la creación de productos financieros.
 *
 * Permite registrar un nuevo producto, validando tanto de forma síncrona como asíncrona los datos ingresados.
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  /**
   * Formulario reactivo para la creación del producto.
   */
  productForm: FormGroup;

  /**
   * Fecha actual, utilizada para validaciones de fecha.
   */
  today: Date = new Date();

  /**
   * Indica si se está realizando una operación de guardado.
   */
  loading = false;

  /**
   * Mensaje de éxito tras crear el producto.
   */
  successMessage: string | null = null;

  /**
   * Mensaje de error en caso de fallo al crear el producto.
   */
  errorMessage: string | null = null;

  /**
   * Inyecta servicios para formularios y operaciones de producto.
   */
  constructor(private fb: FormBuilder, private productService: FinancialProductService) {
    // Inicializa el formulario con validaciones estándar y personalizadas, incluyendo validación asíncrona para el ID.
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idExistsValidator()]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.dateReleaseValidator()]],
      date_revision: ['', [Validators.required, this.dateRevisionValidator()]]
    });
  }

  /**
   * Validador asíncrono para verificar si el ID ya existe en la base de datos.
   * @returns AsyncValidatorFn
   */
  idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Si el campo es inválido localmente, ignora la validación asíncrona
      if (!control.value || control.value.length < 3) {
        return of(null);
      }
      return this.productService.verifyId(control.value).pipe(
        map((exists: boolean) => (exists ? { idExists: true } : null)),
        catchError(() => of(null)),
        first()
      );
    };
  }

  /**
   * Validador para que la fecha de liberación no sea anterior a hoy.
   */
  dateReleaseValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        return { dateReleaseInvalid: true };
      }
      return null;
    };
  }

  /**
   * Validador para que la fecha de revisión sea exactamente un año después de la fecha de liberación.
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
   * Envía el formulario si es válido, crea el producto y gestiona los mensajes de estado.
   * Realiza validación asíncrona antes de enviar.
   */
  onSubmit() {
    // Para asegurar el estado actualizado del form, llama a updateValueAndValidity de forma explícita
    this.productForm.updateValueAndValidity();
    if (this.productForm.valid) {
      this.loading = true;
      this.successMessage = null;
      this.errorMessage = null;
      const formValue = { ...this.productForm.value };
      // Formatea fechas a yyyy-MM-dd
      formValue.date_release = this.formatDate(formValue.date_release);
      formValue.date_revision = this.formatDate(formValue.date_revision);
      this.productService.createProduct(formValue).subscribe({
        next: (resp) => {
          this.successMessage = 'Producto agregado exitosamente.';
          this.loading = false;
          this.productForm.reset();
          this.productForm.markAsPristine();
          this.productForm.markAsUntouched();
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = err.message || 'Solicitud inválida. Verifique los datos.';
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
    if (!date) return '';
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  /**
   * Resetea el formulario a su estado inicial y limpia los estados de validación.
   */
  onReset() {
    this.productForm.reset();
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
  }

  /**
   * Acceso rápido a los controles del formulario para facilitar la validación en la vista.
   */
  get f() { return this.productForm.controls; }
}
