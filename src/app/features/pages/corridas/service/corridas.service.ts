import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Corrida } from '../../../../core/models/corrida.model';
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

  criar(corrida: Corrida): Observable<Corrida> {
    return this.http.post<Corrida>(this.apiUrl, corrida);
  }

  atualizar(id: number, corrida: Corrida): Observable<Corrida> {
    return this.http.put<Corrida>(`${this.apiUrl}/${id}`, corrida);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
