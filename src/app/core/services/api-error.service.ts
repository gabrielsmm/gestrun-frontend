import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  mensagemParaUsuario(error: unknown, mensagemPadrao: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return mensagemPadrao;
    }

    if ([400, 409, 422].includes(error.status)) {
      const mensagemValidacao = this.extrairMensagemValidacao(error.error);
      if (mensagemValidacao) {
        return mensagemValidacao;
      }
    }

    if (error.status === 0) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    }

    return mensagemPadrao;
  }

  private extrairMensagemValidacao(corpo: unknown): string | null {
    if (!corpo || typeof corpo !== 'object') {
      return null;
    }

    const dados = corpo as Record<string, unknown>;
    const candidato = dados['mensagem'] ?? dados['message'];

    if (typeof candidato === 'string' && candidato.trim()) {
      return this.sanitizar(candidato);
    }

    if (Array.isArray(dados['erros'])) {
      const mensagens = dados['erros']
        .map((erro) => {
          if (typeof erro === 'string') return erro;
          if (erro && typeof erro === 'object') {
            const mensagem = (erro as Record<string, unknown>)['mensagem']
              ?? (erro as Record<string, unknown>)['message'];
            return typeof mensagem === 'string' ? mensagem : null;
          }
          return null;
        })
        .filter((erro): erro is string => erro !== null);
      if (mensagens.length) {
        return this.sanitizar(mensagens.join(' '));
      }
    }

    return null;
  }

  private sanitizar(mensagem: string): string {
    return mensagem
      .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '***.***.***-**')
      .replace(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, '***@***')
      .slice(0, 300);
  }
}
