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
import { Corrida } from '../../../../core/models/corrida.model';
import { CorridaSelecionadaService } from '../../../../shared/services/corrida-selecionada.service';
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

  corridas: Corrida[] = [];
  corridasFiltradas: Corrida[] = [];
  corridaSelecionadaNome: string = '';

  constructor(
    private relatorioService: RelatorioService,
    private corridasService: CorridasService,
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

  carregarCorridas(): void {
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
    this.corridaSelecionadaNome = corridaSelecionada ? corridaSelecionada.nome : nome;
    this.corridaId = corridaSelecionada ? corridaSelecionada.id : null;
  }

  gerarRelatorio() {
    this.toastr.clear();

    if (!this.corridaId) {
      this.toastr.error('Selecione uma corrida para gerar o relatório.');
      return;
    }

    switch (this.tipo) {
      case 1:
        this.gerarRelatorioGeral();
        break;
      case 2:
        this.toastr.info('Relatório por Categoria ainda não implementado.');
        break;
      case 3:
        this.toastr.info('Relatório Top 3 / Ranking Geral ainda não implementado.');
        break;
    }
  }

  private gerarRelatorioGeral() {
    this.ngxUiLoaderService.start();

    this.relatorioService.gerarResultadosGeral(this.corridaId!, this.formato).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultado_geral.${this.formato}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao exportar relatório.');
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

}
