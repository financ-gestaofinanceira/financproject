export type GetContasUsuarios = {
  idConta: number;
  titulo: string;
  status: number;
  saldoAtual: number;
  saldoProjetado: number;
  entradaPendente: number;
  saidaPendente: number;
  expirado: boolean | null;
  expiracao: string | null; // pode ajustar para Date se converter depois
  cor: string;
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
  conteudo: GetContasUsuarios[];
  metadados: Metadados;
};
