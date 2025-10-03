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
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Categoria } from '../../../../core/models/categoria.model';
import { CategoriasService } from '../service/categorias.service';
import { SexoCategoria } from './../../../../core/models/sexo-categoria.enum';

@Component({
  selector: 'app-categoria-form',
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
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss'
})
export class CategoriaForm {

  SexoCategoria = SexoCategoria;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<CategoriaForm>,
    @Inject(MAT_DIALOG_DATA) public data: { categoria: Categoria | null, corridaId: number }
  ) {
    const categoria = data.categoria;
    this.form = this.fb.group({
      nome: [categoria?.nome || '', Validators.required],
      idadeMin: [categoria?.idadeMin || '', [Validators.required, Validators.min(0)]],
      idadeMax: [categoria?.idadeMax || '', [Validators.required, Validators.min(0)]],
      sexo: [categoria?.sexo || '', Validators.required]
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const categoriaData = {
      ...this.form.value,
      corridaId: this.data.corridaId
    };

    if (this.data.categoria) {
      this.atualizar(this.data.categoria.id, categoriaData);
    } else {
      this.criar(categoriaData);
    }
  }

  private atualizar(id: number, categoria: Categoria) {
    this.ngxUiLoaderService.start();

    this.categoriasService.atualizar(id, categoria).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao atualizar a categoria. Tente novamente mais tarde.', 'Erro');
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  private criar(categoria: Categoria) {
    this.ngxUiLoaderService.start();

    this.categoriasService.criar(categoria).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao criar a categoria. Tente novamente mais tarde.', 'Erro');
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
