import React, { useEffect, useState, useCallback, useContext } from "react";
import api from "../../../services/api/apiConnect";
import type { ApiResult } from "../../../models/interface/ApiResult";
import type { MovimentacaoPost } from "../../../models/Movimentacoes/MovimentacaoPost";
import type {
  Categoria,
  Movimentacao,
} from "../../../models/Movimentacoes/GetMovimentacoes";
import type { CategoriaResponse } from "../../../models/Categorias/Categorias";
import "./CadMovStyle.css";
import TitleText from "../../../refatoracao/props/TitleText/TitleText";
import InputText from "../../../refatoracao/props/InputText/InputText";
import InputPrice from "../../../refatoracao/props/InputPrice/InputPrice";
import FncButton from "../../../refatoracao/props/FncButton/FncButton";
import { TypeButton } from "../../../refatoracao/props/FncButton/TypeButton";
import ErrorText from "../../../refatoracao/props/ErrorText/ErrorText";
import { AuthContext } from "../../../contexts/AuthContext";
import InputDate from "../../../refatoracao/props/InputDate/InputDate";
import InputCheckBox from "../../../refatoracao/props/InputCheckBox/InputCheckBox";
import CheckBoxList from "../../../refatoracao/props/CheckBoxList/CheckBoxList";

interface PropCadMov {
  onClose: () => void;
  idConta: number;
  buscaMovimentacoes: () => void;
}

const CadMov: React.FC<PropCadMov> = ({
  onClose,
  idConta,
  buscaMovimentacoes,
}) => {
  const getNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const [type, setType] = useState("receita");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorFormatado, setValorFormatado] = useState("");
  const [valor, setValor] = useState(0);
  const [dataMovimentacao, setDataMovimentacao] = useState(getNow);
  const [dataConclusao, setDataConclusao] = useState(getNow);
  const [concluido, setConcluido] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);

  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);

  const setDateMov = (value: string) => {
    setDataMovimentacao(value);
    setDataConclusao(value);
  };

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

  useEffect(() => {
    buscaCategorias();
  }, [buscaCategorias]);

  const criaMov = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErroMsg(undefined);

    const toUTCISOString = (data: string) => new Date(data).toISOString();

    try {
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
        `/Contas/${idConta}/Movimentacoes`,
        "POST",
        request,
      );

      if (resposta.sucesso) {
        buscaMovimentacoes();
        onClose();
      } else {
        setErroMsg(resposta.erro || "Erro ao cadastrar movimentação.");
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
      <TitleText text="Nova Transação" />

      <div className="fnc-transaction-type">
        <button
          type="button"
          className={`type-btn ${type === "receita" ? "active" : ""}`}
          data-type="receita"
          onClick={() => setType("receita")}
        >
          Receita
        </button>

        <button
          type="button"
          className={`type-btn ${type === "despesa" ? "active" : ""}`}
          data-type="despesa"
          onClick={() => setType("despesa")}
        >
          Despesa
        </button>
      </div>

      <form className="centraliza" onSubmit={criaMov}>
        <div className="modal-body">
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

          {erroMsg && <ErrorText text={erroMsg} />}

          <FncButton
            type={TypeButton.Submit}
            title={isLoading ? "Cadastrando..." : "Cadastrar"}
            disabled={isLoading}
          />
        </div>
      </form>
    </>
  );
};

export default CadMov;
