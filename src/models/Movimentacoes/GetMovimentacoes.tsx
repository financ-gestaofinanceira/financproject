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

export type Movimentacao = {
  id: number;
  tipo: number;
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
  usuarioExecutor: null;
  categoria: null;
};

export type GetMovimentacoes = {
  conteudo: {
    resumo: Resumo;
    movimentacaos: Movimentacao[];
  };
  metadados: null;
};
