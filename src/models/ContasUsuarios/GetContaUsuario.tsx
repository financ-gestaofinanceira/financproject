export type UsuarioConviteResponse = {
  conteudo: UsuarioConvite[];
};

export type UsuarioConvite = {
  idUsuario: string;
  nome: string;
  email: string;
  permissao: number;
  status: number;
  expiracao: string | null;
  expirado: boolean;
};
