import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  private apiUrl = `${environment.apiUrl}/api/relatorios`;

  constructor(private http: HttpClient) {}

  gerarResultadosGeral(corridaId: number, formato: 'pdf' | 'xlsx') {
    return this.http.get(`${this.apiUrl}/resultados/geral`, {
      params: { corridaId, formato },
      responseType: 'blob'
    });
  }

}
