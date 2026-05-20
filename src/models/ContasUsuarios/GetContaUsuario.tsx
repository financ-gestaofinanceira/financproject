import type { Metadados } from "./GetContasBancarias";

export type ContaUsuario = {
  idContaUsuario: number;
  idUsuario: string;
  nome: string;
  email: string;
  permissao: number;
  status: number;
  expiracao: string | null;
  expirado: boolean;
};

export type GetContaUsuario = {
  conteudo: ContaUsuario[];
  metadados: Metadados;
};
