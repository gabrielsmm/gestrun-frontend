import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Inscricao } from '../../../../core/models/inscricao.model';
import { SexoInscricao } from '../../../../core/models/sexo-inscricao.enum';
import { StatusInscricao } from '../../../../core/models/status-inscricao.enum';
import { InscricoesService } from '../service/inscricoes.service';

@Component({
  selector: 'app-inscricao-form',
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
    MatButtonModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './inscricao-form.html',
  styleUrl: './inscricao-form.scss'
})
export class InscricaoForm {

  SexoInscricao = SexoInscricao;
  StatusInscricao = StatusInscricao;
  form: FormGroup;
  modo: 'criar' | 'editar' | 'visualizar';
  inscricao: Inscricao | null;

  constructor(
    private fb: FormBuilder,
    private inscricoesService: InscricoesService,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<InscricaoForm>,
    @Inject(MAT_DIALOG_DATA) public data: { inscricao: Inscricao | null, corridaId: number, modo: 'criar' | 'editar' | 'visualizar' }
  ) {
    this.modo = data.modo;
    this.inscricao = data.inscricao;

    if (this.modo === 'criar') {
      this.form = this.fb.group({
        nomeCorredor: ['', Validators.required],
        documento: ['', Validators.required],
        dataNascimento: ['', Validators.required],
        sexo: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefone: ['', Validators.required]
      });
    } else if (this.modo === 'editar') {
      this.form = this.fb.group({
        status: [this.inscricao?.status || 'PENDENTE', Validators.required],
        numeroPeito: [this.inscricao?.numeroPeito || '', Validators.required]
      });
    } else {
      this.form = this.fb.group({});
    }
  }

  salvar(): void {
    if (this.form.invalid) return;

    if (this.modo === 'criar') {
      const inscricaoData = {
        ...this.form.value,
        corridaId: this.data.corridaId
      };
      this.criar(inscricaoData);
    } else if (this.modo === 'editar' && this.inscricao) {
      const inscricaoData = {
        ...this.inscricao,
        ...this.form.value
      };
      this.atualizar(this.inscricao.id, inscricaoData);
    }
  }

  private criar(inscricao: Inscricao) {
    this.ngxUiLoaderService.start();
    this.inscricoesService.criar(inscricao).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao criar inscrição. Tente novamente mais tarde.', 'Erro');
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  private atualizar(id: number, inscricao: Inscricao) {
    this.ngxUiLoaderService.start();
    this.inscricoesService.atualizar(id, inscricao).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao atualizar inscrição. Tente novamente mais tarde.', 'Erro');
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  getDescricaoSexo(sexo: string): string {
    return SexoInscricao[sexo as keyof typeof SexoInscricao] || sexo;
  }

  getDescricaoStatus(status: string): string {
    return StatusInscricao[status as keyof typeof StatusInscricao] || status;
  }

}
