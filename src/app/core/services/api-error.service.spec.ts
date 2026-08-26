import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorService } from './api-error.service';

describe('ApiErrorService', () => {
  const service = new ApiErrorService();
  const fallback = 'Não foi possível concluir a operação.';

  it('preserva mensagens de validação em respostas esperadas', () => {
    const error = new HttpErrorResponse({
      status: 422,
      error: { erros: [{ mensagem: 'A capacidade da corrida foi atingida.' }] }
    });

    expect(service.mensagemParaUsuario(error, fallback)).toBe('A capacidade da corrida foi atingida.');
  });

  it('mascara dados pessoais presentes em mensagens da API', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { mensagem: 'CPF 123.456.789-09 e email atleta@exemplo.com já foram utilizados.' }
    });

    expect(service.mensagemParaUsuario(error, fallback)).toBe('CPF ***.***.***-** e email ***@*** já foram utilizados.');
  });

  it('retorna uma mensagem segura quando não há conexão', () => {
    const error = new HttpErrorResponse({ status: 0 });

    expect(service.mensagemParaUsuario(error, fallback)).toContain('Não foi possível conectar ao servidor');
  });
});
