import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Paginacao } from '../../../../core/models/paginacao.model';
import { Resultado } from '../../../../core/models/resultado.model';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  private apiUrl = `${environment.apiUrl}/api/resultados`;

  constructor(private http: HttpClient) {}

  listarPorCorridaPaginado(
    corridaId: number,
    pagina: number = 0,
    registrosPorPagina: number = 10,
    filtro: string = '',
    ordem: string = 'id',
    direcao: string = 'ASC'
  ): Observable<Paginacao<Resultado>> {
    return this.http.get<Paginacao<Resultado>>(`${this.apiUrl}/corrida/${corridaId}`, {
      params: { pagina, registrosPorPagina, filtro, ordem, direcao }
    });
  }

  criar(resultado: Resultado): Observable<Resultado> {
    return this.http.post<Resultado>(this.apiUrl, resultado);
  }

  atualizar(id: number, resultado: Resultado): Observable<Resultado> {
    return this.http.put<Resultado>(`${this.apiUrl}/${id}`, resultado);
  }

  atualizarLote(resultados: Resultado[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/lote`, resultados);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
