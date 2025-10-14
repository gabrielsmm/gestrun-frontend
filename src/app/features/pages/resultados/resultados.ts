import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of, switchMap } from 'rxjs';
import { Corrida } from '../../../core/models/corrida.model';
import { Resultado } from '../../../core/models/resultado.model';
import { ConfirmacaoDialog, ConfirmacaoDialogData } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { CorridasService } from '../corridas/service/corridas.service';
import { InscricoesService } from '../inscricoes/service/inscricoes.service';
import { ResultadosService } from './service/resultados.service';

interface LinhaResultado {
  numeroPeito?: number;
  inscricaoId?: number;
  nomeCorredor?: string;
  tempo?: string;
  posicaoGeral?: number;
  resultadoId?: number;
}

@Component({
  selector: 'app-resultados',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: './resultados.html',
  styleUrl: './resultados.scss'
})
export class Resultados implements OnInit {

  @ViewChildren('numeroPeitoInput') numeroPeitoInputs!: QueryList<ElementRef>;

  colunas = ['numeroPeito', 'nomeCorredor', 'tempo', 'posicaoGeral', 'acoes'];
  linhasResultados: LinhaResultado[] = [{}];

  corridas: Corrida[] = [];
  corridasFiltradas: Corrida[] = [];
  corridaSelecionada: Corrida | null = null;
  corridaSelecionadaNome = '';

  constructor(
    private resultadosService: ResultadosService,
    private inscricoesService: InscricoesService,
    private corridasService: CorridasService,
    private toastr: ToastrService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarCorridas();
  }

  carregarCorridas(): void {
    this.corridasService.listarPorOrganizadorPaginado(0, 1000, '').subscribe({
      next: (res) => {
        this.corridas = res.conteudo || [];
        this.corridasFiltradas = this.corridas;
      },
      error: () => {
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

    if (this.corridaSelecionada?.id) {
      this.ngxUiLoaderService.start();

      this.resultadosService.listarPorCorridaPaginado(this.corridaSelecionada.id, 0, 1000, '', 'tempo', 'ASC')
      .subscribe({
        next: (res: any) => {
          this.preencherLinhasResultados(res);
        },
        error: () => {
          this.ngxUiLoaderService.stop();
          this.toastr.error('Erro ao carregar resultados da corrida.');
          this.linhasResultados = [{}];
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
    } else {
      this.linhasResultados = [{}];
    }
  }

  private preencherLinhasResultados(res: any): void {
    if (res.conteudo && res.conteudo.length > 0) {
      this.linhasResultados = [
        ...res.conteudo.map((r: any) => ({
          numeroPeito: r.numeroPeito,
          inscricaoId: r.inscricaoId,
          nomeCorredor: r.nomeCorredor,
          tempo: r.tempo,
          posicaoGeral: r.posicaoGeral,
          resultadoId: r.id
        })),
        {}
      ];
    } else {
      this.linhasResultados = [{}];
    }
  }

  buscarInscricao(linha: LinhaResultado): void {
    if (!linha.numeroPeito || !this.corridaSelecionada || !this.corridaSelecionada.id) {
      this.limparLinha(linha);
      return;
    }

    const resultadoExistente = this.linhasResultados.find(
      l => l.numeroPeito === linha.numeroPeito && l.resultadoId
    );

    if (resultadoExistente && resultadoExistente !== linha) {
      this.toastr.warning('Já existe um resultado para este número de peito.');
      return;
    }

    this.ngxUiLoaderService.start();

    this.inscricoesService.buscarPorCorridaENumeroPeito(this.corridaSelecionada.id, linha.numeroPeito)
      .subscribe({
        next: (res) => {
          if (res && res.id) {
            linha.inscricaoId = res.id;
            linha.nomeCorredor = res.nomeCorredor;

            if (resultadoExistente) {
              linha.resultadoId = resultadoExistente.resultadoId;
              linha.tempo = resultadoExistente.tempo;
              linha.posicaoGeral = resultadoExistente.posicaoGeral;
            } else {
              linha.resultadoId = undefined;
              linha.tempo = undefined;
              linha.posicaoGeral = undefined;
            }
          }
        },
        error: (err) => {
          this.ngxUiLoaderService.stop();
          if (err.status === 404) {
            this.toastr.warning('Inscrição não encontrada para o número de peito informado.');
          } else {
            this.toastr.error('Erro ao buscar inscrição.');
          }
          this.limparLinha(linha);
        },
        complete: () => {
          this.ngxUiLoaderService.stop();
        }
      });
  }

  private limparLinha(linha: LinhaResultado): void {
    linha.inscricaoId = undefined;
    linha.nomeCorredor = undefined;
    linha.tempo = undefined;
    linha.posicaoGeral = undefined;
    linha.resultadoId = undefined;
  }

  salvarResultado(linha: LinhaResultado, index: number): void {
    if (!linha.inscricaoId || !linha.tempo) {
      this.toastr.warning('Preencha todos os campos para salvar.');
      return;
    }

    this.ngxUiLoaderService.start();

    // Atualiza posições antes de salvar
    this.atualizarPosicoesGerais();

    const resultado: Resultado = {
      id: linha.resultadoId ?? 0,
      inscricaoId: linha.inscricaoId,
      nomeCorredor: linha.nomeCorredor || '',
      tempo: linha.tempo,
      posicaoGeral: linha.posicaoGeral ?? 0,
      dataCriacao: ''
    };

    const obs = linha.resultadoId
      ? this.resultadosService.atualizar(linha.resultadoId, resultado)
      : this.resultadosService.criar(resultado);

    obs.pipe(
      switchMap(() => {
        // Atualiza todos em lote após salvar o principal
        const resultados: Resultado[] = this.linhasResultados
          .filter(l => l.tempo && l.inscricaoId && l.resultadoId)
          .map(linha => ({
            id: linha.resultadoId!,
            inscricaoId: linha.inscricaoId!,
            nomeCorredor: linha.nomeCorredor || '',
            tempo: linha.tempo!,
            posicaoGeral: linha.posicaoGeral!,
            dataCriacao: ''
          }));

        return this.resultadosService.atualizarLote(resultados);
      }),
      switchMap(() => {
        // Recarrega resultados
        if (this.corridaSelecionada?.id) {
          return this.resultadosService.listarPorCorridaPaginado(this.corridaSelecionada.id, 0, 1000, '', 'tempo', 'ASC');
        }
        return of(null);
      })
    ).subscribe({
      next: (res: any) => {
        if (res) this.preencherLinhasResultados(res);
        this.toastr.success('Resultado salvo e posições atualizadas!');
        this.adicionarNovaLinha();
        this.focarProximoInput(index);
      },
      error: () => {
        this.ngxUiLoaderService.stop();
        this.toastr.error('Erro ao salvar ou atualizar posições.');
      },
      complete: () => {
        this.ngxUiLoaderService.stop();
      }
    });
  }

  excluirResultado(linha: LinhaResultado): void {
    if (!linha.resultadoId) return;

    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      width: '400px',
      data: <ConfirmacaoDialogData>{
        titulo: 'Confirmar exclusão',
        mensagem: `Tem certeza que deseja excluir o resultado da inscrição com número de peito ${linha.numeroPeito}?`,
        confirmarTexto: 'Sim, excluir',
        cancelarTexto: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.ngxUiLoaderService.start();

      this.resultadosService.excluir(linha.resultadoId!)
        .pipe(
          switchMap(() => {
            this.linhasResultados = this.linhasResultados.filter(l => l !== linha);

            this.atualizarPosicoesGerais();

            const resultados: Resultado[] = this.linhasResultados
              .filter(l => l.tempo && l.inscricaoId && l.resultadoId)
              .map(linha => ({
                id: linha.resultadoId!,
                inscricaoId: linha.inscricaoId!,
                nomeCorredor: linha.nomeCorredor || '',
                tempo: linha.tempo!,
                posicaoGeral: linha.posicaoGeral!,
                dataCriacao: ''
              }));

            return resultados.length > 0
              ? this.resultadosService.atualizarLote(resultados)
              : of(null);
          }),
          switchMap(() => {
            if (this.corridaSelecionada?.id) {
              return this.resultadosService.listarPorCorridaPaginado(this.corridaSelecionada.id, 0, 1000, '', 'tempo', 'ASC');
            }
            return of(null);
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res) this.preencherLinhasResultados(res);
            this.toastr.success('Resultado excluído e posições atualizadas!');
            this.adicionarNovaLinha();
          },
          error: () => {
            this.ngxUiLoaderService.stop();
            this.toastr.error('Erro ao excluir ou atualizar posições.');
          },
          complete: () => {
            this.ngxUiLoaderService.stop();
          }
        });
    });
  }

  private atualizarPosicoesGerais(): void {
    // Ordena por tempo (menor tempo = melhor posição)
    const linhasValidas = this.linhasResultados.filter(l => l.tempo && l.inscricaoId);

    linhasValidas.sort((a, b) => {
      // Assume tempo no formato HH:MM:SS
      const ta = this.tempoParaSegundos(a.tempo!);
      const tb = this.tempoParaSegundos(b.tempo!);
      return ta - tb;
    });

    linhasValidas.forEach((linha, idx) => {
      linha.posicaoGeral = idx + 1;
    });
  }

  private tempoParaSegundos(tempo: string): number {
    // Converte HH:MM:SS para segundos
    const partes = tempo.split(':').map(Number);

    if (partes.length === 3) {
      return partes[0] * 3600 + partes[1] * 60 + partes[2];
    } else if (partes.length === 2) {
      return partes[0] * 60 + partes[1];
    } else if (partes.length === 1) {
      return partes[0];
    }

    return 0;
  }

  adicionarNovaLinha(): void {
    const ultima = this.linhasResultados[this.linhasResultados.length - 1];
    if (ultima && ultima.numeroPeito) {
      this.linhasResultados = [...this.linhasResultados, {}];
    }
  }

  focarProximoInput(index: number): void {
    setTimeout(() => {
      const inputs = this.numeroPeitoInputs.toArray();
      if (inputs[index + 1]) {
        inputs[index + 1].nativeElement.focus();
      }
    });
  }

}
