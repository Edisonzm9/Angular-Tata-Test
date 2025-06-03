import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDeleteComponent } from './modal-delete.component';
import { By } from '@angular/platform-browser';

describe('ModalDeleteComponent', () => {
  let component: ModalDeleteComponent;
  let fixture: ComponentFixture<ModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el nombre del producto en el mensaje', () => {
    component.productName = 'ProductoPrueba';
    fixture.detectChanges();
    const mensaje = fixture.nativeElement.querySelector('.modal-message').textContent;
    expect(mensaje).toContain('ProductoPrueba');
  });

  it('debe emitir el evento cancel al hacer click en el botón cancelar', () => {
    jest.spyOn(component.cancel, 'emit');
    const btnCancelar = fixture.debugElement.query(By.css('.btn-cancel')).nativeElement;
    btnCancelar.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('debe emitir el evento confirm al hacer click en el botón confirmar', () => {
    jest.spyOn(component.confirm, 'emit');
    const btnConfirmar = fixture.debugElement.query(By.css('.btn-confirm')).nativeElement;
    btnConfirmar.click();
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('debe emitir cancel al llamar onCancel()', () => {
    jest.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('debe emitir confirm al llamar onConfirm()', () => {
    jest.spyOn(component.confirm, 'emit');
    component.onConfirm();
    expect(component.confirm.emit).toHaveBeenCalled();
  });
});
