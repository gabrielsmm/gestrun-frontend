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
import { Usuario } from '../../../../core/models/usuario.model';
import { UsuariosService } from '../service/usuarios.service';
import { Perfil } from './../../../../core/models/perfil.enum';

@Component({
  selector: 'app-usuario-form',
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
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss'
})
export class UsuarioForm {
  form: FormGroup;
  Perfil = Perfil;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<UsuarioForm>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario | null
  ) {
    this.form = this.fb.group({
      nome: [{ value: usuario?.nome || '', disabled: true }, Validators.required],
      email: [{ value: usuario?.email || '', disabled: true }, [Validators.required, Validators.email]],
      perfil: [usuario?.perfil || Perfil.ORGANIZADOR, Validators.required],
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const usuarioData = this.form.value;

    if (this.usuario) {
      this.atualizar(this.usuario.id, usuarioData);
    } else {
      this.criar(usuarioData);
    }
  }

  private atualizar(id: number, usuario: Usuario) {
    this.ngxUiLoaderService.start();

    this.usuariosService.atualizar(id, usuario).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao atualizar o usuário. Tente novamente mais tarde.', 'Erro');
        console.error('Erro ao atualizar usuário:', err);
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  private criar(usuario: Usuario) {
    this.ngxUiLoaderService.start();

    this.usuariosService.criar(usuario).subscribe({
      next: (res) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao criar o usuário. Tente novamente mais tarde.', 'Erro');
        console.error('Erro ao criar usuário:', err);
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
