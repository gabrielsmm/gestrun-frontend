import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Categoria } from '../../../../core/models/categoria.model';
import { Corrida } from '../../../../core/models/corrida.model';
import { CorridaSelecionadaService } from '../../../../shared/services/corrida-selecionada.service';
import { downloadBlob } from '../../../../shared/utils/download.util';
import { CategoriasService } from '../../categorias/service/categorias.service';
import { CorridasService } from '../../corridas/service/corridas.service';
import { RelatorioService } from '../service/relatorio.service';

@Component({
  selector: 'app-relatorio-resultados',
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  templateUrl: './relatorio-resultados.html',
  styleUrl: './relatorio-resultados.scss'
})
export class RelatorioResultados {

  tiposRelatorio = [
    { tipo: 1, descricao: 'Resultado Geral' },
    { tipo: 2, descricao: 'Resultado por Categoria' },
    { tipo: 3, descricao: 'Top 3 / Ranking Geral' }
  ];

  tipo: number = 1;
  formato: 'pdf' | 'xlsx' = 'pdf';
  corridaId: number | null = null;
  categoriaId: number | null = null;

  corridas: Corrida[] = [];
  corridasFiltradas: Corrida[] = [];
  corridaSelecionadaNome: string = '';
  categorias: Categoria[] = [];

  constructor(
    private relatorioService: RelatorioService,
    private corridasService: CorridasService,
    private categoriasService: CategoriasService,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private corridaSelecionadaService: CorridaSelecionadaService
  ) {}

  ngOnInit() {
    this.carregarCorridas();

    const corridaSalva = this.corridaSelecionadaService.obterCorrida();
    if (corridaSalva) {
      this.corridaId = corridaSalva.id;
      this.corridaSelecionadaNome = corridaSalva.nome;
    }
  }

  private carregarCorridas(): void {
    this.corridasService.listarPorOrganizadorPaginado(0, 1000, '').subscribe({
      next: (res) => {
        this.corridas = res.conteudo || [];
        this.corridasFiltradas = this.corridas;
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar corridas.');
      }
    });
  }

  filtrarCorridas(valor: string): void {
    const filtro = valor.toLowerCase();
    this.corridasFiltradas = this.corridas.filter(c => c.nome.toLowerCase().includes(filtro));
  }

  selecionarCorrida(nome: string): void {
    const corridaSelecionada: Corrida | null = this.corridas.find(c => c.nome === nome) || null;
    this.corridaId = corridaSelecionada ? corridaSelecionada.id : null;
    this.corridaSelecionadaNome = corridaSelecionada ? corridaSelecionada.nome : nome;
    if (this.tipo === 2) {
      this.carregarCategorias();
    }
  }

  onTipoChange(valor: any) {
    if (valor === 2) {
      this.carregarCategorias();
    }
  }

  private carregarCategorias() {
    if (!this.corridaId) {
      return;
    }

    this.categoriasService.listarPorCorridaPaginado(this.corridaId, 0, 1000).subscribe({
      next: (res) => {
        this.categorias = res.conteudo || [];
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar categorias.');
      }
    });
  }

  gerarRelatorio() {
    this.toastr.clear();

    switch (this.tipo) {
      case 1:
        this.gerarRelatorioGeral();
        break;
      case 2:
        this.gerarRelatorioPorCategoria();
        break;
      case 3:
        this.toastr.info('Relatório Top 3 / Ranking Geral ainda não implementado.');
        break;
    }
  }

  private gerarRelatorioGeral() {
    if (!this.corridaId) {
      this.toastr.error('Selecione uma corrida para gerar o relatório.');
      return;
    }

    this.ngxUiLoaderService.start();

    this.relatorioService.gerarResultadosGeral(this.corridaId!, this.formato).subscribe({
      next: (blob: Blob) => {
        downloadBlob(blob, `resultado_geral.${this.formato}`);
      },
      error: (err) => {
        this.ngxUiLoaderService.stop();
        if (err.status === 404) {
          this.toastr.warning('Relatório sem dados para os filtros informados.');
        } else {
          this.toastr.error('Erro ao exportar relatório.');
        }
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  private gerarRelatorioPorCategoria() {
    if (!this.corridaId || !this.categoriaId) {
      this.toastr.error('Selecione uma corrida e uma categoria para gerar o relatório.');
      return;
    }

    this.ngxUiLoaderService.start();

    this.relatorioService.gerarResultadosPorCategoria(this.corridaId!, this.categoriaId!, this.formato).subscribe({
      next: (blob: Blob) => {
        downloadBlob(blob, `resultado_categoria.${this.formato}`);
      },
      error: (err) => {
        this.ngxUiLoaderService.stop();
        if (err.status === 404) {
          this.toastr.warning('Relatório sem dados para os filtros informados.');
        } else {
          this.toastr.error('Erro ao exportar relatório.');
        }
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

}
