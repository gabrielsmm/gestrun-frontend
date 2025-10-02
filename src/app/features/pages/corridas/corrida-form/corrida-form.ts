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
import { Corrida } from '../../../../core/models/corrida.model';
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

  constructor(
    private fb: FormBuilder,
    private corridasService: CorridasService,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<CorridaForm>,
    @Inject(MAT_DIALOG_DATA) public corrida: Corrida | null
  ) {
    this.form = this.fb.group({
      nome: [corrida?.nome || '', Validators.required],
      data: [corrida?.data || '', [Validators.required, dataFuturaValidator]],
      local: [corrida?.local || '', Validators.required],
      distanciaKm: [corrida?.distanciaKm || 0.1, [Validators.required, Validators.min(0.1)]],
      regulamento: [corrida?.regulamento || '', Validators.required]
    });
  }

  salvar(): void {
      if (this.form.invalid) return;

      const corridaData = this.form.value;

      if (this.corrida) {
        this.atualizar(this.corrida.id, corridaData);
      } else {
        this.criar(corridaData);
      }
    }

    private atualizar(id: number, corrida: Corrida) {
      this.ngxUiLoaderService.start();

      this.corridasService.atualizar(id, corrida).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error('Erro ao atualizar a corrida. Tente novamente mais tarde.', 'Erro');
          console.error('Erro ao atualizar corrida:', err);
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
    }

    private criar(corrida: Corrida) {
      this.ngxUiLoaderService.start();

      this.corridasService.criar(corrida).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error('Erro ao criar a corrida. Tente novamente mais tarde.', 'Erro');
          console.error('Erro ao criar corrida:', err);
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
    }

    cancelar(): void {
      this.dialogRef.close(false);
    }

}
