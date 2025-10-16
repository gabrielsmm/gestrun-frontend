import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Corrida } from '../../../core/models/corrida.model';
import { Inscricao } from '../../../core/models/inscricao.model';
import { SexoInscricao } from '../../../core/models/sexo-inscricao.enum';
import { StatusInscricao } from '../../../core/models/status-inscricao.enum';
import { ConfirmacaoDialog, ConfirmacaoDialogData } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { CorridaSelecionadaService } from '../../../shared/services/corrida-selecionada.service';
import { CorridasService } from '../corridas/service/corridas.service';
import { InscricaoForm } from './inscricao-form/inscricao-form';
import { InscricoesService } from './service/inscricoes.service';

@Component({
  selector: 'app-inscricoes',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    FormsModule,
    NgxMaskPipe
  ],
  templateUrl: './inscricoes.html',
  styleUrl: './inscricoes.scss'
})
export class Inscricoes implements OnInit {

  colunas = ['nomeCorredor', 'documento', 'dataNascimento', 'sexo', 'email', 'telefone', 'status', 'numeroPeito', 'acoes'];
  inscricoes: Inscricao[] = [];
  totalRegistros = 0;
  registrosPorPagina = 10;
  pagina = 0;
  filtro = '';

  corridas: Corrida[] = [];
  corridasFiltradas: Corrida[] = [];
  corridaSelecionada: Corrida | null = null;
  corridaSelecionadaNome = '';

  private filtroSubject = new Subject<string>();

  constructor(
    private inscricoesService: InscricoesService,
    private corridasService: CorridasService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private corridaSelecionadaService: CorridaSelecionadaService
  ) {}

  ngOnInit(): void {
    this.filtroSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((valor) => {
      this.filtro = valor;
      this.pagina = 0;
      this.carregarInscricoes();
    });

    this.carregarCorridas();

    const corridaSalva = this.corridaSelecionadaService.obterCorrida();
    if (corridaSalva) {
      this.corridaSelecionada = corridaSalva;
      this.corridaSelecionadaNome = corridaSalva.nome;
      this.carregarInscricoes();
    }
  }

  carregarCorridas(): void {
    this.corridasService.listarPorOrganizadorPaginado(0, 100, '').subscribe({
      next: (res) => {
        this.corridas = res.conteudo || [];
        this.corridasFiltradas = this.corridas;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar corridas.', 'Erro');
      }
    });
  }

  filtrarCorridas(valor: string): void {
    const filtro = valor.toLowerCase();
    this.corridasFiltradas = this.corridas.filter(c => c.nome.toLowerCase().includes(filtro));
  }

  selecionarCorrida(nome: string): void {
    this.corridaSelecionada = this.corridas.find(c => c.nome === nome) || null;
    this.corridaSelecionadaNome = nome;
    this.pagina = 0;
    if (this.corridaSelecionada) {
      this.corridaSelecionadaService.salvarCorrida(this.corridaSelecionada);
    }
    this.carregarInscricoes();
  }

  carregarInscricoes(): void {
    if (!this.corridaSelecionada) {
      this.inscricoes = [];
      this.totalRegistros = 0;
      return;
    }

    this.ngxUiLoaderService.start();

    this.inscricoesService
      .listarPorCorridaPaginado(this.corridaSelecionada.id, this.pagina, this.registrosPorPagina, this.filtro)
      .subscribe({
        next: (res) => {
          this.inscricoes = res.conteudo || [];
          this.totalRegistros = res.totalElementos;
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error('Erro ao carregar inscrições.', 'Erro');
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
    this.carregarInscricoes();
  }

  abrirForm(inscricao?: Inscricao, modo: 'criar' | 'editar' | 'visualizar' = 'criar'): void {
    const dialogRef = this.dialog.open(InscricaoForm, {
      width: '600px',
      data: {
        inscricao: inscricao ?? null,
        corridaId: this.corridaSelecionada?.id,
        modo
      }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.carregarInscricoes();
      }
    });
  }

  excluir(inscricao: Inscricao): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      width: '400px',
      data: <ConfirmacaoDialogData>{
        titulo: 'Confirmar exclusão',
        mensagem: `Tem certeza que deseja excluir a inscrição de ${inscricao.nomeCorredor}?`,
        confirmarTexto: 'Sim, excluir',
        cancelarTexto: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.ngxUiLoaderService.start();
        this.inscricoesService.excluir(inscricao.id).subscribe({
          next: () => {
            this.carregarInscricoes();
          },
          error: () => {
            this.ngxUiLoaderService.stop();
            this.toastr.error('Erro ao excluir inscrição.', 'Erro');
          },
          complete: () => {
            this.ngxUiLoaderService.stop();
          }
        });
      }
    });
  }

  getDescricaoSexo(sexo: string): string {
    return SexoInscricao[sexo as keyof typeof SexoInscricao] || sexo;
  }

  getDescricaoStatus(status: string): string {
    return StatusInscricao[status as keyof typeof StatusInscricao] || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDENTE': return 'bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded';
      case 'CANCELADA': return 'bg-red-100 text-red-700 font-bold px-2 py-1 rounded';
      case 'CONFIRMADA': return 'bg-green-100 text-green-700 font-bold px-2 py-1 rounded';
      default: return '';
    }
  }

}
