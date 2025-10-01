import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../../../core/models/usuario.model';
import { Observable } from 'rxjs';
import { Paginacao } from '../../../../core/models/paginacao.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  listar(
    pagina: number = 0,
    registrosPorPagina: number = 10,
    filtro: string = '',
    ordem: string = 'id',
    direcao: string = 'ASC'
  ): Observable<Paginacao<Usuario>> {
    return this.http.get<Paginacao<Usuario>>(this.apiUrl, {
      params: { pagina, registrosPorPagina, filtro, ordem, direcao }
    });
  }

  criar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  atualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
