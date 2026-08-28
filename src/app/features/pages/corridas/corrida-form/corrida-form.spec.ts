import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { CorridaForm } from './corrida-form';
import { CorridasService } from '../service/corridas.service';

describe('CorridaForm', () => {
  let component: CorridaForm;
  let fixture: ComponentFixture<CorridaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorridaForm],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: CorridasService, useValue: jasmine.createSpyObj('CorridasService', ['criar', 'atualizar']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['error']) },
        { provide: NgxUiLoaderService, useValue: jasmine.createSpyObj('NgxUiLoaderService', ['start', 'stop']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorridaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('preenche a abertura e exige os demais campos obrigatórios', () => {
    expect(component.form.get('inscricoesAbertura')?.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(component.form.get('dataHoraInicio')?.hasError('required')).toBeTrue();
    expect(component.form.get('valorInscricao')?.hasError('required')).toBeTrue();
    expect(component.form.get('inscricoesEncerramento')?.hasError('required')).toBeTrue();
    expect(component.form.get('capacidade')?.hasError('required')).toBeTrue();
  });

  it('preenche o encerramento padrão ao informar o início da corrida', () => {
    component.form.get('dataHoraInicio')?.setValue('2026-08-10T08:00');

    expect(component.form.get('inscricoesEncerramento')?.value).toBe('2026-08-09T23:59');
  });

  it('preserva o encerramento alterado manualmente', () => {
    component.form.get('dataHoraInicio')?.setValue('2026-08-10T08:00');
    component.form.get('inscricoesEncerramento')?.setValue('2026-08-08T18:00');
    component.form.get('dataHoraInicio')?.setValue('2026-08-12T08:00');

    expect(component.form.get('inscricoesEncerramento')?.value).toBe('2026-08-08T18:00');
  });

  it('rejeita períodos de inscrição inválidos', () => {
    component.form.patchValue({
      inscricoesAbertura: '2026-08-01T10:00',
      inscricoesEncerramento: '2026-08-01T09:00',
      dataHoraInicio: '2026-08-02T08:00'
    });

    expect(component.form.hasError('aberturaAposEncerramento')).toBeTrue();

    component.form.patchValue({
      inscricoesEncerramento: '2026-08-02T09:00'
    });

    expect(component.form.hasError('encerramentoAposInicio')).toBeTrue();
  });
});
