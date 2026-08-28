import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { Corrida } from '../../../../core/models/corrida.model';
import { CorridaInsertRequest } from '../../../../core/models/corrida-insert-request.model';
import { CorridaUpdateRequest } from '../../../../core/models/corrida-update-request.model';
import { ApiErrorService } from '../../../../core/services/api-error.service';
import { CorridasService } from '../service/corridas.service';

function dataFuturaValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;
  const hoje = new Date();
  const dataSelecionada = new Date(valor);
  hoje.setHours(0,0,0,0);
  dataSelecionada.setHours(0,0,0,0);
  return dataSelecionada >= hoje ? null : { dataPassada: true };
}

function periodoInscricoesValidator(control: AbstractControl): ValidationErrors | null {
  const abertura = control.get('inscricoesAbertura')?.value;
  const encerramento = control.get('inscricoesEncerramento')?.value;
  const dataHoraInicio = control.get('dataHoraInicio')?.value;

  if (!abertura || !encerramento || !dataHoraInicio) {
    return null;
  }

  if (abertura >= encerramento) {
    return { aberturaAposEncerramento: true };
  }

  return encerramento < dataHoraInicio ? null : { encerramentoAposInicio: true };
}

function paraDataHoraLocal(valor: string | undefined): string {
  return valor ? valor.slice(0, 16) : '';
}

function paraIso8601(valor: string): string {
  return valor.length === 16 ? `${valor}:00` : valor;
}

function formatarDataHoraLocal(data: Date): string {
  const doisDigitos = (valor: number) => String(valor).padStart(2, '0');
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
    + `T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

function proximoIntervaloDeCincoMinutos(data: Date): Date {
  const arredondada = new Date(data);
  arredondada.setSeconds(0, 0);
  const minutos = arredondada.getMinutes();
  arredondada.setMinutes(minutos + ((5 - (minutos % 5)) % 5));

  if (data.getSeconds() > 0 || data.getMilliseconds() > 0) {
    arredondada.setMinutes(arredondada.getMinutes() + 5);
  }

  return arredondada;
}

function encerramentoPadrao(dataHoraInicio: string): string {
  const [data] = dataHoraInicio.split('T');
  const [ano, mes, dia] = data.split('-').map(Number);
  const encerramento = new Date(ano, mes - 1, dia - 1, 23, 59, 0, 0);
  return formatarDataHoraLocal(encerramento);
}

@Component({
  selector: 'app-corrida-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogContent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './corrida-form.html',
  styleUrl: './corrida-form.scss'
})
export class CorridaForm {

  form: FormGroup;
  private encerramentoAlteradoManualmente = false;
  private atualizandoEncerramentoPadrao = false;
  private readonly subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private corridasService: CorridasService,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private apiErrorService: ApiErrorService,
    private dialogRef: MatDialogRef<CorridaForm>,
    @Inject(MAT_DIALOG_DATA) public corrida: Corrida | null
  ) {
    this.form = this.fb.group({
      nome: [corrida?.nome || '', Validators.required],
      dataHoraInicio: [paraDataHoraLocal(corrida?.dataHoraInicio), [Validators.required, dataFuturaValidator]],
      local: [corrida?.local || '', Validators.required],
      distanciaKm: [corrida?.distanciaKm || 0.1, [Validators.required, Validators.min(0.1)]],
      regulamento: [corrida?.regulamento || '', Validators.required],
      valorInscricao: [corrida?.valorInscricao ?? null, [Validators.required, Validators.min(0)]],
      inscricoesAbertura: [corrida ? paraDataHoraLocal(corrida.inscricoesAbertura) : formatarDataHoraLocal(proximoIntervaloDeCincoMinutos(new Date())), Validators.required],
      inscricoesEncerramento: [paraDataHoraLocal(corrida?.inscricoesEncerramento), Validators.required],
      capacidade: [corrida?.capacidade ?? null, [Validators.required, Validators.min(0)]]
    }, { validators: periodoInscricoesValidator });

    if (!corrida) {
      this.observarValoresPadrao();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  salvar(): void {
      if (this.form.invalid) return;

      const corridaData = this.obterDadosFormulario();

      if (this.corrida) {
        this.atualizar(this.corrida.id, corridaData);
      } else {
        this.criar(corridaData);
      }
    }

    private atualizar(id: number, corrida: CorridaUpdateRequest) {
      this.ngxUiLoaderService.start();

      this.corridasService.atualizar(id, corrida).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error(this.apiErrorService.mensagemParaUsuario(err, 'Erro ao atualizar a corrida. Tente novamente mais tarde.'), 'Erro');
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
    }

    private criar(corrida: CorridaInsertRequest) {
      this.ngxUiLoaderService.start();

      this.corridasService.criar(corrida).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error(this.apiErrorService.mensagemParaUsuario(err, 'Erro ao criar a corrida. Tente novamente mais tarde.'), 'Erro');
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
    }

    cancelar(): void {
      this.dialogRef.close(false);
    }

    private obterDadosFormulario(): CorridaInsertRequest {
      const dados = this.form.getRawValue();

      return {
        nome: dados.nome,
        dataHoraInicio: paraIso8601(dados.dataHoraInicio),
        local: dados.local,
        distanciaKm: Number(dados.distanciaKm),
        regulamento: dados.regulamento,
        valorInscricao: Number(dados.valorInscricao),
        inscricoesAbertura: paraIso8601(dados.inscricoesAbertura),
        inscricoesEncerramento: paraIso8601(dados.inscricoesEncerramento),
        capacidade: Number(dados.capacidade)
      };
    }

    private observarValoresPadrao(): void {
      const dataHoraInicio = this.form.get('dataHoraInicio');
      const inscricoesEncerramento = this.form.get('inscricoesEncerramento');

      this.subscriptions.add(
        dataHoraInicio!.valueChanges.subscribe((valor: string) => {
          if (valor && !this.encerramentoAlteradoManualmente) {
            this.preencherEncerramentoPadrao(valor);
          }
        })
      );

      this.subscriptions.add(
        inscricoesEncerramento!.valueChanges.subscribe(() => {
          if (!this.atualizandoEncerramentoPadrao) {
            this.encerramentoAlteradoManualmente = true;
          }
        })
      );
    }

    private preencherEncerramentoPadrao(dataHoraInicio: string): void {
      this.atualizandoEncerramentoPadrao = true;
      this.form.get('inscricoesEncerramento')?.setValue(encerramentoPadrao(dataHoraInicio));
      this.atualizandoEncerramentoPadrao = false;
    }

}
