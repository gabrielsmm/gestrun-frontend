import { Perfil } from "./perfil.enum";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  dataCriacao: string; // ISO date vindo do backend
}
