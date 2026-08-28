export interface CorridaInsertRequest {
  nome: string;
  dataHoraInicio: string;
  local: string;
  distanciaKm: number;
  regulamento: string;
  valorInscricao: number;
  inscricoesAbertura: string;
  inscricoesEncerramento: string;
  capacidade: number;
}
