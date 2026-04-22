export type Resumo = {
  saldoRealizado: number;
  saldoProjetado: number;
  entrada: {
    concluidos: number;
    pendentes: number;
    projetado: number;
  };
  saida: {
    concluidos: number;
    pendentes: number;
    projetado: number;
  };
};

export type UsuarioCriador = {
  idContaUsuario: number;
  idUsuario: string;
  email: string;
  primeiroNome: string;
  segundoNome: string;
  nomeCompleto: string;
};

export type Categoria = {
  idCategoria: number;
  nome: string;
  cor: string;
};

export type Movimentacao = {
  id: number;
  tipo: number; // ideal: enum depois
  idConta: number;
  idFixo: number;
  concluido: boolean;
  valor: number;
  titulo: string;
  observacao: string | null;
  dthrReg: string;
  dthrMovimentacao: string;
  dthrConclusao: string | null;
  usarioCriador: UsuarioCriador;
  usuarioExecutor: UsuarioCriador | null; // assumindo padrão
  categoria: Categoria | null;
};

export type ConteudoMovimentacoes = {
  resumo: Resumo;
  movimentacaos: Movimentacao[];
};

export type GetMovimentacoes = {
  conteudo: ConteudoMovimentacoes;
  metadados: any | null;
};
