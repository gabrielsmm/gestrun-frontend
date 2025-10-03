import { SexoCategoria } from "./sexo-categoria.enum";

export interface Categoria {
  id: number;
  nome: string;
  idadeMin: number;
  idadeMax: number;
  sexo: SexoCategoria;
  corridaId: number;
}
