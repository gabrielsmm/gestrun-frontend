import { Perfil } from "./perfil.enum";

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
  perfil?: Perfil;
}
