import React, { useEffect, useState, useCallback, useContext } from "react";
import api from "../.././services/api/apiConnect";
import type { ApiResult } from "../../models/interface/ApiResult";
import type {
  Categoria,
  CategoriaResponse,
} from "../../models/Categorias/Categorias";
import "./CategoriasStyle.css";
import FncButton from "../../props/FncButton/FncButton";
import { TypeButton } from "../../props/FncButton/TypeButton";
import ErrorText from "../../props/ErrorText/ErrorText";
import { TypeThemeButton } from "../../props/FncButton/TypeThemeButton";
import InputTextAndColor from "../../props/InputTextAndColor/InputTextAndColor";
import TitleText from "../../props/TitleText/TitleText";
import type { FncTableColumn } from "../../props/FncTable/FncTable";
import FncTable from "../../props/FncTable/FncTable";

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
      );
      if (resposta.sucesso && resposta.dados) {
        setCategorias(resposta.dados);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, [idConta]);

  const handleCategoriaClick = async (objetoDaLinha: any) => {
    console.log(objetoDaLinha);
    setCategoriaSelecionada(objetoDaLinha.categoria);
    setTituloEditor(objetoDaLinha.nome);
    setCorEditor(objetoDaLinha.categoria.cor);
    setEditOnly(true);
  };

  const cadastraCategoria = () => {
    interface IConvite {
      id: number;
      nome: string;
      categoria: Categoria;
    }
    const colunas: FncTableColumn[] = [{ header: "Nome", key: "nome" }];

    let convitesData: IConvite[] = [];
    categorias?.conteudo.map((cat) => {
      convitesData.push({
        id: cat.idCategoria,
        nome: cat.nome,
        categoria: cat,
      });
    });

    return (
      <>
        <form onSubmit={criaCategoriaRequest}>
          <div className="fnc-table-categorias">
            <TitleText text="Categorias" />
            <FncTable
              columns={colunas}
              data={convitesData}
              onRowClick={handleCategoriaClick}
            />
          </div>
          <div className="modal-body">
            <InputTextAndColor
              label="Nova Categoria"
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
        <form className="fnc-ctn-categoria" onSubmit={EditaCategoriaRequest}>
          <TitleText text="Alterar Categoria" />

          <div className="fnc-preview-name-cat">
            <div className="categoria" style={{ background: corEditor }}>
              <p style={{ color: getTextColor(corEditor) }}>{tituloEditor}</p>
            </div>
          </div>

          <InputTextAndColor
            label="Editar Categoria"
            color={corEditor}
            onChangeColor={setCorEditor}
            placeholder="Ex: Alimentação"
            text={tituloEditor}
            setText={setTituloEditor}
          />

          {erroMsg && <ErrorText text={erroMsg} />}

          <div className="fnc-btn-edit-cat">
            <FncButton
              type={TypeButton.Submit}
              disabled={isLoading}
              thema={TypeThemeButton.Cancel}
              title="Cancelar"
              onClick={() => {
                setErroMsg("");
                setEditOnly(false);
              }}
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
      );

      if (resposta.sucesso) {
        buscaCategorias();
        buscaMovimentacoes();
        setTitulo("");
        setCor("#314158");
      } else {
        setErroMsg(resposta.erro);
      }
    } catch (error: any) {
      setErroMsg(error.message);
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

      console.log(categoriaSelecionada);
      const resposta = await api<ApiResult<CategoriaResponse>>(
        `/Contas/Categorias/${categoriaSelecionada?.idCategoria}/Alterar`,
        "PATCH",
        request,
      );

      if (resposta.sucesso) {
        buscaCategorias();
        buscaMovimentacoes();
        setEditOnly(false);
      } else {
        setErroMsg(resposta!.erro);
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
      );

      if (resposta.sucesso) {
        setErroMsg("");
        buscaCategorias();
        setEditOnly(false);
        buscaMovimentacoes();
      } else {
        setErroMsg(resposta.erro);
      }
    } catch (error: any) {
      setErroMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return <>{!editOnly ? cadastraCategoria() : editaCategoria()}</>;
};

export default Categorias;
