import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Perfil } from '../../../core/models/perfil.enum';
import { ConfirmacaoDialog, ConfirmacaoDialogData } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { Usuario } from './../../../core/models/usuario.model';
import { UsuariosService } from './service/usuarios.service';
import { UsuarioForm } from './usuario-form/usuario-form';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios {
  Perfil = Perfil;
  colunas = ['nome', 'email', 'perfil', 'acoes'];
  usuarios: Usuario[] = [];
  totalRegistros = 0;
  registrosPorPagina = 10;
  pagina = 0;
  filtro = '';

  private filtroSubject = new Subject<string>();

  constructor(
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {}

    ngOnInit(): void {
      this.filtroSubject.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe((valor) => {
        this.filtro = valor;
        this.pagina = 0;
        this.carregarUsuarios();
      });

      this.carregarUsuarios();
    }


  carregarUsuarios(): void {
    this.ngxUiLoaderService.start();

    this.usuariosService
      .listar(this.pagina, this.registrosPorPagina, this.filtro)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.usuarios = res.conteudo;
          this.totalRegistros = res.totalElementos;
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

  aplicarFiltro(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.filtroSubject.next(valor);
  }

  mudarPagina(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.registrosPorPagina = event.pageSize;
    this.carregarUsuarios();
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
