import React, { useEffect, useState, useCallback } from "react";
import api from "../../../services/api/apiConnect";
import type { ApiResult } from "../../../models/interface/ApiResult";
import type { MovimentacaoPost } from "../../../models/Movimentacoes/MovimentacaoPost";
import type { Movimentacao } from "../../../models/Movimentacoes/GetMovimentacoes";
import type { CategoriaResponse } from "../../../models/Categorias/Categorias";
import "./CadMovStyle.css";
import TitleText from "../../../refatoracao/props/TitleText/TitleText";
import InputText from "../../../refatoracao/props/InputText/InputText";
import InputPrice from "../../../refatoracao/props/InputPrice/InputPrice";
import FncButton from "../../../refatoracao/props/FncButton/FncButton";
import { TypeButton } from "../../../refatoracao/props/FncButton/TypeButton";
import ErrorText from "../../../refatoracao/props/ErrorText/ErrorText";

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

  const [type, setType] = useState<"receita" | "despesa">("receita");
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
        idCategoria: categoriaId,
      };

      const resposta = await api<ApiResult<Movimentacao>>(
        `/Contas/${idConta}/Movimentacoes`,
        "POST",
        request,
        true,
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

  return (
    <>
      <TitleText text="Nova Transação" />
      <div className="transaction-type">
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

          <div className="input-group">
            <label>Categoria</label>
            <select
              value={categoriaId ?? ""}
              onChange={(e) => setCategoriaId(Number(e.target.value))}
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {categorias?.conteudo.map((categoria) => (
                <option
                  key={categoria.idCategoria}
                  value={categoria.idCategoria}
                >
                  <div className="categoria">
                    <p>{categoria.nome}</p>
                  </div>
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Data Movimentação</label>
            <input
              type="datetime-local"
              value={dataMovimentacao}
              onChange={(e) => {
                setDataMovimentacao(e.target.value);
                setDataConclusao(e.target.value);
              }}
              required
            />
          </div>

          <div className="input-group">
            <label>
              <input
                type="checkbox"
                checked={concluido}
                onChange={() => setConcluido(!concluido)}
              />{" "}
              Movimentação concluída
            </label>
          </div>

          {concluido && (
            <div className="input-group">
              <label>Data Conclusão</label>
              <input
                type="datetime-local"
                value={dataConclusao}
                onChange={(e) => setDataConclusao(e.target.value)}
                required
              />
            </div>
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
