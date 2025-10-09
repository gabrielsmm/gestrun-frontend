export interface Resultado {
  id: number;
  inscricaoId: number;
  nomeCorredor: string;
  tempo: string; // Formato "HH:MM:SS"
  posicaoGeral: number;
  dataCriacao: string;
}
