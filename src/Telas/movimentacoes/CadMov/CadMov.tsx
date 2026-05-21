import React, { useEffect, useState, useContext } from "react";
import api from "../../../services/api/apiConnect";
import type { ApiResult } from "../../../models/interface/ApiResult";
import type { MovimentacaoPost } from "../../../models/Movimentacoes/MovimentacaoPost";
import type {
  Categoria,
  Movimentacao,
} from "../../../models/Movimentacoes/GetMovimentacoes";
import type { CategoriaResponse } from "../../../models/Categorias/Categorias";
import "./CadMovStyle.css";
import TitleText from "../../../props/TitleText/TitleText";
import InputText from "../../../props/InputText/InputText";
import InputPrice from "../../../props/InputPrice/InputPrice";
import FncButton from "../../../props/FncButton/FncButton";
import { TypeButton } from "../../../props/FncButton/TypeButton";
import ErrorText from "../../../props/ErrorText/ErrorText";
import InputDate from "../../../props/InputDate/InputDate";
import InputCheckBox from "../../../props/InputCheckBox/InputCheckBox";
import CheckBoxList from "../../../props/CheckBoxList/CheckBoxList";
import { MovimentacaoContext } from "../../../contexts/MovimentacaoContext";
import { ContaContext } from "../../../contexts/ContaContext";
import type { MovimentacaoPatch } from "../../../models/Movimentacoes/MovimentacaoPatch";

interface PropCadMov {
  onClose: () => void;
  edit?: boolean;
}

const CadMov: React.FC<PropCadMov> = ({ onClose, edit = false }) => {
  const getNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const { conta } = useContext(ContaContext);

  const { movimentacao } = useContext(MovimentacaoContext);
  const [type, setType] = useState("receita");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorFormatado, setValorFormatado] = useState("");
  const [valor, setValor] = useState(0);
  const [dataMovimentacao, setDataMovimentacao] = useState(getNow);
  const [dataConclusao, setDataConclusao] = useState(getNow);
  const [concluido, setConcluido] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);

  const setDateMov = (value: string) => {
    setDataMovimentacao(value);
    setDataConclusao(value);
  };

  const buscaCategorias = async () => {
    try {
      console.log("Mamei");
      const resposta = await api<CategoriaResponse>(
        `/Contas/${conta?.idConta}/Categorias`,
        "GET",
        undefined,
      );
      if (resposta.sucesso && resposta.dados) {
        setCategorias(resposta.dados);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    buscaCategorias();

    if (edit && movimentacao) {
      const formatDataToInput = (data: string) => {
        const dataUtc = new Date(data);

        const offset = dataUtc.getTimezoneOffset();

        const dataLocal = new Date(dataUtc.getTime() - offset * 60000);

        return dataLocal.toISOString().slice(0, 16);
      };
      setType(movimentacao.tipo === 0 ? "receita" : "despesa");
      setTitulo(movimentacao.titulo);
      setDescricao(movimentacao.observacao ?? "");
      setValor(movimentacao.valor);
      setValorFormatado(
        movimentacao.valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      );
      console.log(formatDataToInput(movimentacao.dthrMovimentacao));
      setDataMovimentacao(formatDataToInput(movimentacao.dthrMovimentacao));
      setDataConclusao(
        movimentacao.dthrConclusao
          ? formatDataToInput(movimentacao.dthrConclusao)
          : dataMovimentacao,
      );
      setConcluido(movimentacao.concluido);

      let editCatId: number[] = [];
      movimentacao.categorias.map((cat) => {
        editCatId.push(cat.idCategoria);
      });
      setCategoriasSelecionadas(editCatId);
    }
  }, [edit, movimentacao]);

  const reqMov = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErroMsg(undefined);

    const toUTCISOString = (data: string) => new Date(data).toISOString();

    try {
      if (!edit) {
        const request: MovimentacaoPost = {
          tipo: type === "receita" ? 0 : 1,
          valor: valor,
          concluido: concluido,
          titulo: titulo,
          observacao: descricao,
          dthrMovimentacao: toUTCISOString(dataMovimentacao),
          dthrConclusao: concluido ? toUTCISOString(dataConclusao) : null,
          idsCategoria: categoriasSelecionadas,
        };

        const resposta = await api<ApiResult<Movimentacao>>(
          `/Contas/${conta?.idConta}/Movimentacoes`,
          "POST",
          request,
        );

        if (resposta.sucesso) {
          onClose();
        } else {
          setErroMsg(resposta.erro || "Erro ao cadastrar movimentação.");
        }
      } else {
        const request: MovimentacaoPatch = {
          tipo: concluido ? null : type === "receita" ? 0 : 1,
          valor: movimentacao?.valor !== valor ? valor : null,
          titulo: movimentacao?.titulo !== titulo ? titulo : null,
          observacao: movimentacao?.observacao !== descricao ? descricao : null,
          dthrMovimentacao:
            movimentacao?.dthrMovimentacao !== dataMovimentacao
              ? toUTCISOString(dataMovimentacao)
              : null,
          dthrConclusao: movimentacao?.concluido
            ? movimentacao?.dthrMovimentacao !== toUTCISOString(dataConclusao)
              ? toUTCISOString(dataConclusao)
              : null
            : null,
        };
        console.log(request);
        const resposta = await api<ApiResult<Movimentacao>>(
          `Contas/Movimentacoes/${movimentacao?.id}/Alterar`,
          "PATCH",
          request,
        );

        if (!resposta.sucesso) {
          setErroMsg(resposta.erro || "Erro ao cadastrar movimentação.");
          return;
        }

        let catMov: number[] = [];
        movimentacao!.categorias.map((cat) => catMov.push(cat.idCategoria));

        console.log(
          JSON.stringify(catMov.sort()) !==
            JSON.stringify(categoriasSelecionadas.sort()),
        );
        if (
          JSON.stringify(catMov.sort()) !==
          JSON.stringify(categoriasSelecionadas.sort())
        ) {
          const resposta = await api<ApiResult<Movimentacao>>(
            `Contas/Movimentacoes/${movimentacao?.id}/Alterar/Categoria`,
            "PUT",
            {
              categorias: categoriasSelecionadas,
            },
          );

          if (resposta.sucesso) {
            onClose();
          } else {
            setErroMsg(resposta.erro || "Erro ao cadastrar movimentação.");
          }
        } else onClose();
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };
  {
    console.log(categoriasSelecionadas);
  }

  return (
    <>
      <TitleText text={edit ? "Editar Transação" : "Nova Transação"} />

      <div className="fnc-transaction-type">
        <button
          type="button"
          className={`type-btn ${type === "receita" ? "active" : ""}`}
          data-type="receita"
          onClick={() => (!movimentacao?.concluido ? setType("receita") : null)}
        >
          Receita
        </button>

        <button
          type="button"
          className={`type-btn ${type === "despesa" ? "active" : ""}`}
          data-type="despesa"
          onClick={() => (!movimentacao?.concluido ? setType("despesa") : null)}
        >
          Despesa
        </button>
      </div>

      <form onSubmit={reqMov}>
        <div className="fnc-ctn-cad">
          <InputText
            label="Título"
            text={titulo}
            placeholder="Ex: Mercado"
            setText={setTitulo}
          />

          <InputText
            label="Descrição"
            text={descricao}
            placeholder="Ex: Compra do mês"
            setText={setDescricao}
            maxLenght={255}
          />

          <InputPrice
            label="Valor (R$)"
            formattedValue={valorFormatado}
            setValue={setValor}
            setFormattedValue={setValorFormatado}
          />

          <CheckBoxList<Categoria>
            itens={categorias?.conteudo ?? []}
            idKey="idCategoria"
            labelKey="nome"
            selecionados={categoriasSelecionadas}
            onChange={setCategoriasSelecionadas}
            label="Categorias"
          />
          <InputDate
            label="Data Movimentação"
            text={dataMovimentacao}
            setText={setDateMov}
          />

          {edit && movimentacao && concluido && (
            <>
              <InputDate
                label="Data Conclusão"
                text={dataConclusao}
                setText={setDataConclusao}
              />
            </>
          )}
          {!edit && (
            <>
              <InputCheckBox
                label="Movimentação concluída"
                checked={concluido}
                setChecked={setConcluido}
              />

              {concluido && (
                <InputDate
                  label="Data Conclusão"
                  text={dataConclusao}
                  setText={setDataConclusao}
                />
              )}
            </>
          )}

          {erroMsg && <ErrorText text={erroMsg} />}
          <FncButton
            type={TypeButton.Submit}
            title={
              edit
                ? isLoading
                  ? "Editando..."
                  : "Editar"
                : isLoading
                  ? "Cadastrando..."
                  : "Cadastrar"
            }
            disabled={isLoading}
          />
        </div>
      </form>
    </>
  );
};

export default CadMov;
