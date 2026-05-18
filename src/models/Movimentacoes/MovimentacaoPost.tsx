export type MovimentacaoPost = {
  tipo: number;
  valor: number;
  concluido: boolean;
  titulo: string;
  observacao: string;
  dthrMovimentacao: string;
  dthrConclusao: string | null;
  idsCategoria: number[];
};
