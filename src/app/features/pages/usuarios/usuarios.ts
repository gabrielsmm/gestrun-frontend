import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmacaoDialog, ConfirmacaoDialogData } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { Usuario } from './../../../core/models/usuario.model';
import { UsuariosService } from './service/usuarios.service';
import { UsuarioForm } from './usuario-form/usuario-form';
import { Perfil } from '../../../core/models/perfil.enum';

@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios {
  Perfil = Perfil;
  usuarios: Usuario[] = [];
  colunas = ['nome', 'email', 'perfil', 'acoes'];

  constructor(
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.ngxUiLoaderService.start();

    this.usuariosService.listar().subscribe({
      next: (res) => {
        this.usuarios = res;
      },
      error: (err) => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao carregar usuários. Tente novamente mais tarde.', 'Erro');
        console.error('Erro ao carregar usuários:', err);
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  abrirForm(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioForm, {
      width: '600px',
      data: usuario ?? null
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.carregarUsuarios();
      }
    });
  }

  excluir(usuario: Usuario): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      width: '400px',
      data: <ConfirmacaoDialogData>{
        titulo: 'Confirmar exclusão',
        mensagem: `Tem certeza que deseja excluir o usuário ${usuario.nome}?`,
        confirmarTexto: 'Sim, excluir',
        cancelarTexto: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.ngxUiLoaderService.start();

        this.usuariosService.excluir(usuario.id).subscribe({
          next: (res) => {
            this.toastr.success('Usuário excluído com sucesso.', 'Sucesso');
            this.carregarUsuarios();
          },
          error: (err) => {
            this.ngxUiLoaderService.stop();
            this.toastr.error('Erro ao excluir usuário. Tente novamente mais tarde.', 'Erro');
            console.error('Erro ao excluir usuário:', err);
          },
          complete: () => {
            this.ngxUiLoaderService.stop();
          }
        });
      }
    });
  }
}
