import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Inscricao } from '../../../../core/models/inscricao.model';
import { Paginacao } from '../../../../core/models/paginacao.model';

@Injectable({
  providedIn: 'root'
})
export class InscricoesService {

  private apiUrl = `${environment.apiUrl}/api/inscricoes`;

  constructor(private http: HttpClient) {}

  listarPorCorridaPaginado(
    corridaId: number,
    pagina: number = 0,
    registrosPorPagina: number = 10,
    filtro: string = '',
    ordem: string = 'id',
    direcao: string = 'ASC'
  ): Observable<Paginacao<Inscricao>> {
    return this.http.get<Paginacao<Inscricao>>(`${this.apiUrl}/corrida/${corridaId}`, {
      params: { pagina, registrosPorPagina, filtro, ordem, direcao }
    });
  }

  criar(inscricao: Inscricao): Observable<Inscricao> {
    return this.http.post<Inscricao>(this.apiUrl, inscricao);
  }

  atualizar(id: number, inscricao: Inscricao): Observable<Inscricao> {
    return this.http.put<Inscricao>(`${this.apiUrl}/${id}`, inscricao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
