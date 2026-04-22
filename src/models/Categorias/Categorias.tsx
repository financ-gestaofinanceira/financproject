export type Categoria = {
  idCategoria: number;
  nome: string;
  cor: string;
};

export type CategoriaResponse = {
  conteudo: Categoria[];
  metadados: any | null;
};

export type CategoriaPost = {
  valor: Categoria;
};
