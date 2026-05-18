export type ConviteResponse = {
  conteudo: ConviteItem[];
};

export type ConviteItem = {
  convite: Convite;
  conta: Conta;
  usuarioRemetente: Usuario;
  usuarioDestinatario: Usuario;
};

export type Convite = {
  idConvite: number;
  acesso: number;
  aceito: boolean | null;
  dataEnvio: string;
  dataExpiracao: string;
};

export type Conta = {
  idConta: number;
  titulo: string;
  tipoConta: number;
};

export type Usuario = {
  idUsuario: string;
  primeiroNome: string;
  segundoNome: string;
  nomeCompleto: string;
};
