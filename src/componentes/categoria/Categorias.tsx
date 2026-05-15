import React, { useEffect, useState, useCallback } from "react";
import api from "../.././services/api/apiConnect";
import type { ApiResult } from "../../models/interface/ApiResult";
import type {
  Categoria,
  CategoriaResponse,
} from "../../models/Categorias/Categorias";
import "./CategoriasStyle.css";
import FncButton from "../../refatoracao/props/FncButton/FncButton";
import { TypeButton } from "../../refatoracao/props/FncButton/TypeButton";
import ErrorText from "../../refatoracao/props/ErrorText/ErrorText";
import { TypeThemeButton } from "../../refatoracao/props/FncButton/TypeThemeButton";
import InputColor from "../../refatoracao/props/InputColor/InputColor";
import InputText from "../../refatoracao/props/InputText/InputText";
import InputTextAndColor from "../../refatoracao/props/InputTextAndColor/InputTextAndColor";
import SubtitleText from "../../refatoracao/props/SubtitleText/SubtitleText";
import TitleText from "../../refatoracao/props/TitleText/TitleText";

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
        <TitleText text="Categorias" />

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

            <InputTextAndColor
              color={cor}
              onChangeColor={setCor}
              placeholder="Ex: Alimentação"
              text={titulo}
              setText={setTitulo}
            />

            {erroMsg && <ErrorText text={erroMsg} />}

            <FncButton
              type={TypeButton.Submit}
              title={isLoading ? "Cadastrando..." : "Cadastrar"}
            />
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
          <TitleText text="Alterar Categoria" />
        </div>
        <div className="categoria" style={{ background: corEditor }}>
          <p style={{ color: getTextColor(corEditor) }}>{tituloEditor}</p>
        </div>
        <form className="centraliza" onSubmit={EditaCategoriaRequest}>
          <div className="modal-body">
            <SubtitleText text="Novo nome" />
            <InputTextAndColor
              color={corEditor}
              onChangeColor={setCorEditor}
              placeholder="Ex: Alimentação"
              text={tituloEditor}
              setText={setTituloEditor}
            />

            {erroMsg && <p className="error">{erroMsg}</p>}

            <div className="ctn-vertical">
              <FncButton
                type={TypeButton.Submit}
                disabled={isLoading}
                thema={TypeThemeButton.Cancel}
                title="Cancelar"
                onClick={() => setEditOnly(false)}
              />
              <FncButton
                type={TypeButton.Submit}
                disabled={isLoading}
                title={isLoading ? "Editando..." : "Editar"}
              />
              <FncButton
                type={TypeButton.Submit}
                thema={TypeThemeButton.Delete}
                title="Deletar"
                onClick={DeletarCategoriaRequest}
              />
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
