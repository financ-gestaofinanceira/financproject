import React, { useEffect, useState, useCallback } from "react";
import api from "../.././services/api/apiConnect";
import type { ApiResult } from "../../models/interface/ApiResult";
import type {
  Categoria,
  CategoriaResponse,
} from "../../models/Categorias/Categorias";
import "./CategoriasStyle.css";

interface PropCadMov {
  idConta: number;
  buscaMovimentacoes: () => void;
}

const Categorias: React.FC<PropCadMov> = ({ buscaMovimentacoes, idConta }) => {
  function getTextColor(bgColor: string) {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);

    // fórmula de luminância simplificada
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 186 ? "#000000" : "#FFFFFF";
  }

  const [titulo, setTitulo] = useState("");
  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | undefined>();
  const [cor, setCor] = useState("#314158");

  const [editOnly, setEditOnly] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | null>();

  const [tituloEditor, setTituloEditor] = useState("");
  const [corEditor, setCorEditor] = useState("");

  const buscaCategorias = useCallback(async () => {
    try {
      const resposta = await api<CategoriaResponse>(
        `/Contas/${idConta}/Categorias`,
        "GET",
        undefined,
        true,
      );
      if (resposta.sucesso && resposta.dados) {
        setCategorias(resposta.dados);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, [idConta]);

  const cadastraCategoria = () => {
    return (
      <>
        <div className="modal-header">
          <h2>Categorias</h2>
        </div>

        <form className="centraliza" onSubmit={criaCategoriaRequest}>
          <div className="modal-body">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>NOME</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias?.conteudo?.map((cat) => (
                    <tr key={cat.idCategoria}>
                      <td
                        onClick={() => {
                          setCategoriaSelecionada(cat);
                          setTituloEditor(cat.nome);
                          setCorEditor(cat.cor);
                          setEditOnly(true);
                        }}
                      >
                        <div
                          className="categoria"
                          style={{ background: cat.cor }}
                        >
                          <p style={{ color: getTextColor(cat.cor) }}>
                            {cat.nome}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="input-group-horizontal">
              <div className="input-categoria">
                <div className="input-color">
                  <label className="color-wrapper">
                    <div
                      className="color-preview"
                      style={{ background: cor }}
                    />
                    <input
                      type="color"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={titulo}
                  maxLength={80}
                  placeholder="Ex: Alimentação"
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>
            </div>

            {erroMsg && <p className="error">{erroMsg}</p>}

            <button
              type="submit"
              className="botão-transação"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </>
    );
  };
  const editaCategoria = () => {
    if (categoriaSelecionada === null || categoriaSelecionada === undefined) {
      setEditOnly(false);
      return;
    }

    return (
      <>
        <div className="modal-header">
          <h2>Alterar Categoria</h2>
        </div>
        <div className="categoria" style={{ background: corEditor }}>
          <p style={{ color: getTextColor(corEditor) }}>{tituloEditor}</p>
        </div>
        <form className="centraliza" onSubmit={EditaCategoriaRequest}>
          <div className="modal-body">
            <p>Novo nome</p>
            <div className="input-categoria">
              <div className="input-color">
                <label className="color-wrapper">
                  <div
                    className="color-preview"
                    style={{ background: corEditor }}
                  />
                  <input
                    type="color"
                    value={corEditor}
                    onChange={(e) => setCorEditor(e.target.value)}
                  />
                </label>
              </div>

              <input
                type="text"
                value={tituloEditor}
                maxLength={80}
                placeholder="Ex: Alimentação"
                onChange={(e) => setTituloEditor(e.target.value)}
                required
              />
            </div>

            {erroMsg && <p className="error">{erroMsg}</p>}

            <div className="ctn-vertical">
              <button
                type="submit"
                className="botão-cancelamento"
                onClick={() => setEditOnly(false)}
              >
                {"Cancelar"}
              </button>
              <button
                type="submit"
                className="botão-transação"
                disabled={isLoading}
              >
                {isLoading ? "Editando..." : "Editar"}
              </button>
              <button
                type="submit"
                className="botão-deletar"
                onClick={DeletarCategoriaRequest}
              >
                {"Deletar"}
              </button>
            </div>
          </div>
        </form>
      </>
    );
  };

  useEffect(() => {
    buscaCategorias();
  }, [buscaCategorias]);

  const criaCategoriaRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErroMsg(undefined);

    try {
      const request = {
        nome: titulo,
        cor: cor,
      };

      const resposta = await api<ApiResult<CategoriaResponse>>(
        `/Contas/${idConta}/Categorias`,
        "POST",
        request,
        true,
      );

      if (resposta.sucesso) {
        buscaCategorias();
        buscaMovimentacoes();
        setTitulo("");
        setCor("#314158");
      } else {
        setErroMsg(resposta.erro || "Erro ao cadastrar categoria.");
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const EditaCategoriaRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErroMsg(undefined);

    try {
      const request = {
        nome: tituloEditor,
        cor: corEditor,
      };

      const resposta = await api<ApiResult<CategoriaResponse>>(
        `/Contas/Categorias/${categoriaSelecionada?.idCategoria}/Alterar`,
        "PATCH",
        request,
        true,
      );

      if (resposta.sucesso) {
        buscaCategorias();
        buscaMovimentacoes();
        setEditOnly(false);
      } else {
        setErroMsg(resposta.erro || "Erro ao cadastrar categoria.");
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  async function DeletarCategoriaRequest() {
    try {
      const resposta = await api<string>(
        `/Contas/Categorias/${categoriaSelecionada?.idCategoria}/Remover`,
        "DELETE",
        undefined,
        true,
      );

      if (resposta.sucesso) {
        buscaCategorias();
        setEditOnly(false);
        buscaMovimentacoes();
      } else {
        setErroMsg(resposta.erro || "Erro ao cadastrar categoria.");
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }
  return <>{!editOnly ? cadastraCategoria() : editaCategoria()}</>;
};

export default Categorias;
