export interface Paginacao<T> {
  conteudo: T[];
  totalElementos: number;
  totalPaginas: number;
  tamanho: number;
  pagina: number;
}
