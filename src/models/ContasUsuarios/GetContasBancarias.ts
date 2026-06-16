export type ContaBancaria = {
  idConta: number;
  titulo: string;
  contaFavorita: boolean;
  somaSaldo: boolean;
  status: number;
  saldoAtual: number;
  saldoProjetado: number;
  entradaPendente: number;
  saidaPendente: number;
  expiracao: string | null;
  cor: string;
};

export type ConteudoContas = {
  saldoRealizado: number;
  saldoProjetado: number;
  entradaPendente: number;
  saidaPendente: number;
  contas: ContaBancaria[];
};

export type Filtros = {
  id: number | null;
  titulo: string | null;
  status: number | null;
};

export type Metadados = {
  total: number;
  pagina: number;
  tamanho: number;
  totalPaginas: number;
  filtros: Filtros;
};

export type ContaResponse = {
  conteudo: ConteudoContas;
  metadados: Metadados;
};
