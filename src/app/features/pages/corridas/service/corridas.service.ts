import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Corrida } from '../../../../core/models/corrida.model';
import { CorridaInsertRequest } from '../../../../core/models/corrida-insert-request.model';
import { CorridaPublicacaoRequest } from '../../../../core/models/corrida-publicacao-request.model';
import { CorridaUpdateRequest } from '../../../../core/models/corrida-update-request.model';
import { Paginacao } from '../../../../core/models/paginacao.model';

@Injectable({
  providedIn: 'root'
})
export class CorridasService {

  private apiUrl = `${environment.apiUrl}/api/corridas`;

  constructor(private http: HttpClient) {}

  listarPorOrganizadorPaginado(
    pagina: number = 0,
    registrosPorPagina: number = 10,
    filtro: string = '',
    ordem: string = 'id',
    direcao: string = 'ASC'
  ): Observable<Paginacao<Corrida>> {
    return this.http.get<Paginacao<Corrida>>(`${this.apiUrl}/organizador`, {
      params: { pagina, registrosPorPagina, filtro, ordem, direcao }
    });
  }

  criar(corrida: CorridaInsertRequest): Observable<Corrida> {
    return this.http.post<Corrida>(this.apiUrl, corrida);
  }

  atualizar(id: number, corrida: CorridaUpdateRequest): Observable<Corrida> {
    return this.http.put<Corrida>(`${this.apiUrl}/${id}`, corrida);
  }

  alterarPublicacao(id: number, publicada: boolean): Observable<Corrida> {
    const payload: CorridaPublicacaoRequest = { publicada };
    return this.http.patch<Corrida>(`${this.apiUrl}/${id}/publicacao`, payload);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
