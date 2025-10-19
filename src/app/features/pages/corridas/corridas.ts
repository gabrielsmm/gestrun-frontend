import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Corrida } from '../../../core/models/corrida.model';
import { ConfirmacaoDialog, ConfirmacaoDialogData } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { CorridaForm } from './corrida-form/corrida-form';
import { CorridasService } from './service/corridas.service';

@Component({
  selector: 'app-corridas',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './corridas.html',
  styleUrl: './corridas.scss'
})
export class Corridas implements OnInit {

  colunas = ['nome', 'data', 'local', 'distanciaKm', 'acoes'];
  corridas: Corrida[] = [];
  totalRegistros = 0;
  registrosPorPagina = 10;
  pagina = 0;
  filtro = '';

  private filtroSubject = new Subject<string>();

  constructor(
    private corridasService: CorridasService,
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
      this.carregarCorridas();
    });

    this.carregarCorridas();
  }

  carregarCorridas(): void {
    this.ngxUiLoaderService.start();

    this.corridasService
      .listarPorOrganizadorPaginado(this.pagina, this.registrosPorPagina, this.filtro)
      .subscribe({
        next: (res) => {
          this.corridas = res.conteudo || [];
          this.totalRegistros = res.totalElementos;
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error('Erro ao carregar corridas. Tente novamente mais tarde.', 'Erro');
          console.error('Erro ao carregar corridas:', err);
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
    this.carregarCorridas();
  }

  abrirForm(corrida?: Corrida): void {
    const dialogRef = this.dialog.open(CorridaForm, {
      width: '600px',
      data: corrida ?? null
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.carregarCorridas();
      }
    });
  }

  excluir(corrida: Corrida): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      width: '400px',
      data: <ConfirmacaoDialogData>{
        titulo: 'Confirmar exclusão',
        mensagem: `Tem certeza que deseja excluir a corrida ${corrida.nome}?`,
        confirmarTexto: 'Sim, excluir',
        cancelarTexto: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.ngxUiLoaderService.start();

        this.corridasService.excluir(corrida.id).subscribe({
          next: (res) => {
            this.toastr.success('Corrida excluída com sucesso.', 'Sucesso');
            this.carregarCorridas();
          },
          error: (err) => {
            this.ngxUiLoaderService.stop();
            this.toastr.error('Erro ao excluir corrida. Tente novamente mais tarde.', 'Erro');
            console.error('Erro ao excluir corrida:', err);
          },
          complete: () => {
            this.ngxUiLoaderService.stop();
          }
        });
      }
    });
  }

}
