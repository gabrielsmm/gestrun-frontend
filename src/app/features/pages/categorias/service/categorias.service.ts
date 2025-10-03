import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Categoria } from '../../../../core/models/categoria.model';
import { Paginacao } from '../../../../core/models/paginacao.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiUrl = `${environment.apiUrl}/api/categorias`;

  constructor(private http: HttpClient) {}

  listarPorCorridaPaginado(
    corridaId: number,
    pagina: number = 0,
    registrosPorPagina: number = 10,
    filtro: string = '',
    ordem: string = 'id',
    direcao: string = 'ASC'
  ): Observable<Paginacao<Categoria>> {
    return this.http.get<Paginacao<Categoria>>(`${this.apiUrl}/corrida/${corridaId}`, {
      params: { pagina, registrosPorPagina, filtro, ordem, direcao }
    });
  }

  criar(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  atualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
