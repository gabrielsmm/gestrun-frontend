import { Injectable } from '@angular/core';
import { Corrida } from '../../core/models/corrida.model';

@Injectable({ providedIn: 'root' })
export class CorridaSelecionadaService {
  private readonly STORAGE_KEY = 'corridaSelecionada';

  salvarCorrida(corrida: Corrida) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(corrida));
  }

  obterCorrida(): Corrida | null {
    const corridaStr = localStorage.getItem(this.STORAGE_KEY);
    return corridaStr ? JSON.parse(corridaStr) : null;
  }

  limparCorrida() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
