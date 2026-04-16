export type MovimentacaoPost = {
  idConta: number;
  tipo: number;
  valor: number;
  concluido: boolean;
  titulo: string;
  observacao: string;
  dthrMovimentacao: string;
  dthrConclusao: string | null;
};
