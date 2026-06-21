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

// "2026-09-10T01:32:00Z" → "2026-09-10T01:32"
const utcISOParaInputLocal = (data: string): string =>
  data.substring(0, 16).replace("Z", "");

// "2026-09-10T01:32" → "2026-09-10T01:32:00.000Z"
const inputParaUTCISO = (data: string): string =>
  new Date(data + ":00.000Z").toISOString();

const getNowUTC = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}T${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`;
};

const CadMov: React.FC<PropCadMov> = ({ onClose, edit = false }) => {
  const { conta } = useContext(ContaContext);
  const { movimentacao } = useContext(MovimentacaoContext);

  const [type, setType] = useState("receita");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorFormatado, setValorFormatado] = useState("");
  const [valor, setValor] = useState(0);
  const [dataMovimentacao, setDataMovimentacao] = useState(getNowUTC);
  const [dataConclusao, setDataConclusao] = useState(getNowUTC);
  const [concluido, setConcluido] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);

  const [dataMovOriginal, setDataMovOriginal] = useState("");
  const [dataConclusaoOriginal, setDataConclusaoOriginal] = useState("");

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);

  const setDateMov = (value: string) => {
    setDataMovimentacao(value);
    setDataConclusao(value);
  };

  const buscaCategorias = async () => {
    try {
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

      const dataMov = utcISOParaInputLocal(movimentacao.dthrMovimentacao);
      setDataMovimentacao(dataMov);
      setDataMovOriginal(movimentacao.dthrMovimentacao);

      if (movimentacao.dthrConclusao) {
        const dataCon = utcISOParaInputLocal(movimentacao.dthrConclusao);
        setDataConclusao(dataCon);
        setDataConclusaoOriginal(movimentacao.dthrConclusao);
      } else {
        setDataConclusao(dataMov);
        setDataConclusaoOriginal("");
      }

      setConcluido(movimentacao.concluido);

      const editCatId = movimentacao.categorias.map((cat) => cat.idCategoria);
      setCategoriasSelecionadas(editCatId);
    }
  }, [edit, movimentacao]);

  // Materializa a movimentação virtual (id=0 com idFixo) antes de editar.
  // Retorna o id real, ou null em caso de erro.
  const materializarSeNecessario = async (): Promise<number | null> => {
    if (!movimentacao) return null;

    // Movimentação real — usa o id direto
    if (movimentacao.id > 0) return movimentacao.id;

    // Movimentação virtual gerada por agendamento — precisa materializar antes do PATCH
    if (movimentacao.idFixo && movimentacao.id === 0) {
      try {
        const resposta = await api<any>(
          `/Contas/${movimentacao.idConta}/Movimentacoes/Fixa/${movimentacao.idFixo}/Materializa`,
          "POST",
          {
            dataMovimentacao: new Date(
              movimentacao.dthrMovimentacao,
            ).toISOString(),
          },
        );
        if (resposta.sucesso && resposta.dados) {
          const mov: Movimentacao = resposta.dados.valor;
          return mov.id;
        } else {
          setErroMsg(resposta.erro || "Erro ao materializar movimentação.");
          return null;
        }
      } catch (error: any) {
        setErroMsg(error.message || "Erro inesperado.");
        return null;
      }
    }

    return null;
  };

  const reqMov = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErroMsg(undefined);

    try {
      if (!edit) {
        const request: MovimentacaoPost = {
          tipo: type === "receita" ? 0 : 1,
          valor: valor,
          concluido: concluido,
          titulo: titulo,
          observacao: descricao,
          dthrMovimentacao: inputParaUTCISO(dataMovimentacao),
          dthrConclusao: concluido ? inputParaUTCISO(dataConclusao) : null,
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
        // Se for movimentação virtual (id=0 + idFixo), materializa agora
        const idMov = await materializarSeNecessario();
        if (idMov === null) return;

        const dataMovAtualUTC = inputParaUTCISO(dataMovimentacao);
        const dataConclusaoAtualUTC = inputParaUTCISO(dataConclusao);

        const request: MovimentacaoPatch = {
          tipo: concluido ? null : type === "receita" ? 0 : 1,
          valor: movimentacao?.valor !== valor ? valor : null,
          titulo: movimentacao?.titulo !== titulo ? titulo : null,
          observacao: movimentacao?.observacao !== descricao ? descricao : null,
          dthrMovimentacao:
            dataMovAtualUTC !== dataMovOriginal ? dataMovAtualUTC : null,
          dthrConclusao: movimentacao?.concluido
            ? dataConclusaoAtualUTC !== dataConclusaoOriginal
              ? dataConclusaoAtualUTC
              : null
            : null,
        };

        console.log(request);

        const resposta = await api<ApiResult<Movimentacao>>(
          `Contas/Movimentacoes/${idMov}/Alterar`,
          "PATCH",
          request,
        );

        if (!resposta.sucesso) {
          setErroMsg(resposta.erro || "Erro ao editar movimentação.");
          return;
        }

        const catMov = movimentacao!.categorias.map((cat) => cat.idCategoria);

        if (
          JSON.stringify(catMov.sort()) !==
          JSON.stringify(categoriasSelecionadas.sort())
        ) {
          const respostaCat = await api<ApiResult<Movimentacao>>(
            `Contas/Movimentacoes/${idMov}/Alterar/Categoria`,
            "PUT",
            { categorias: categoriasSelecionadas },
          );

          if (respostaCat.sucesso) {
            onClose();
          } else {
            setErroMsg(respostaCat.erro || "Erro ao alterar categorias.");
          }
        } else {
          onClose();
        }
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <InputDate
              label="Data Conclusão"
              text={dataConclusao}
              setText={setDataConclusao}
            />
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
