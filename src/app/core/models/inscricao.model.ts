import { SexoInscricao } from "./sexo-inscricao.enum";
import { StatusInscricao } from "./status-inscricao.enum";

export interface Inscricao {
  id: number;
  corridaId: number;
  nomeCorredor: string;
  documento: string;
  dataNascimento: string;
  sexo: SexoInscricao;
  email: string;
  telefone: string;
  status: StatusInscricao;
  numeroPeito: number;
  dataCriacao: string;
}
