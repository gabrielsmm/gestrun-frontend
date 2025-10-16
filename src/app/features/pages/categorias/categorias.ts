import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { Categoria } from '../../../core/models/categoria.model';
import { Corrida } from '../../../core/models/corrida.model';
import { SexoCategoria } from '../../../core/models/sexo-categoria.enum';
import { ConfirmacaoDialog, ConfirmacaoDialogData } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { CorridaSelecionadaService } from '../../../shared/services/corrida-selecionada.service';
import { CorridasService } from '../corridas/service/corridas.service';
import { CategoriaForm } from './categoria-form/categoria-form';
import { CategoriasService } from './service/categorias.service';

@Component({
  selector: 'app-categorias',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    FormsModule
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss'
})
export class Categorias {

  colunas = ['nome', 'idadeMin', 'idadeMax', 'sexo', 'acoes'];
  categorias: Categoria[] = [];
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
    private categoriasService: CategoriasService,
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
      this.carregarCategorias();
    });

    this.carregarCorridas();

    const corridaSalva = this.corridaSelecionadaService.obterCorrida();
    if (corridaSalva) {
      this.corridaSelecionada = corridaSalva;
      this.corridaSelecionadaNome = corridaSalva.nome;
      this.carregarCategorias();
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
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    if (!this.corridaSelecionada) {
      this.categorias = [];
      this.totalRegistros = 0;
      return;
    }

    this.ngxUiLoaderService.start();

    this.categoriasService
      .listarPorCorridaPaginado(this.corridaSelecionada.id, this.pagina, this.registrosPorPagina, this.filtro)
      .subscribe({
        next: (res) => {
          this.categorias = res.conteudo || [];
          this.totalRegistros = res.totalElementos;
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          this.toastr.error('Erro ao carregar categorias.', 'Erro');
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
    this.carregarCategorias();
  }

  abrirForm(categoria?: Categoria): void {
    const dialogRef = this.dialog.open(CategoriaForm, {
      width: '600px',
      data: { categoria: categoria ?? null, corridaId: this.corridaSelecionada?.id }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.carregarCategorias();
      }
    });
  }

  excluir(categoria: Categoria): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      width: '400px',
      data: <ConfirmacaoDialogData>{
        titulo: 'Confirmar exclusão',
        mensagem: `Tem certeza que deseja excluir a categoria ${categoria.nome}?`,
        confirmarTexto: 'Sim, excluir',
        cancelarTexto: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.ngxUiLoaderService.start();

        this.categoriasService.excluir(categoria.id).subscribe({
          next: () => {
            this.toastr.success('Categoria excluída com sucesso.', 'Sucesso');
            this.carregarCategorias();
          },
          error: () => {
            this.ngxUiLoaderService.stop();
            this.toastr.error('Erro ao excluir categoria.', 'Erro');
          },
          complete: () => {
            this.ngxUiLoaderService.stop();
          }
        });
      }
    });
  }

  getDescricaoSexo(sexo: string): string {
    return SexoCategoria[sexo as keyof typeof SexoCategoria] || sexo;
  }

}
