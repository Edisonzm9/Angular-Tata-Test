import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Componente de modal para confirmar la eliminación de un producto.
 * 
 * Muestra un mensaje de confirmación y expone eventos para cancelar o confirmar la acción.
 */
@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent {
  /**
   * Nombre del producto a mostrar en el mensaje de confirmación.
   */
  @Input() productName: string = '';

  /**
   * Evento emitido cuando el usuario cancela la acción.
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Evento emitido cuando el usuario confirma la eliminación.
   */
  @Output() confirm = new EventEmitter<void>();

  /**
   * Maneja el clic en el botón de cancelar y emite el evento correspondiente.
   */
  onCancel() {
    this.cancel.emit();
  }

  /**
   * Maneja el clic en el botón de confirmar y emite el evento correspondiente.
   */
  onConfirm() {
    this.confirm.emit();
  }
}
