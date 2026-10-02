
export interface PageResponse<T> {
  conteudo: T[];
  paginaAtual: number;
  tamanhoPagina: number;
  total: number;
  totalPaginas: number;
}
