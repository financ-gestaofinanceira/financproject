import React, { useEffect, useState, useCallback } from "react";
import api from "../../../services/api/apiConnect";
import type { ApiResult } from "../../../models/interface/ApiResult";
import type { MovimentacaoPost } from "../../../models/Movimentacoes/MovimentacaoPost";
import type { Movimentacao } from "../../../models/Movimentacoes/GetMovimentacoes";
import type { CategoriaResponse } from "../../../models/Categorias/Categorias";
import "./CadMovStyle.css";
import type {
  ContaResponse,
  GetContasUsuarios,
} from "../../../models/ContasUsuarios/GetContasUsuarios";

interface PropCadMov {
  onClose: () => void;
  idConta: number;
  buscaMovimentacoes: () => void;
  setContaBancaria: React.Dispatch<
    React.SetStateAction<GetContasUsuarios | undefined>
  >;
}

const CadMov: React.FC<PropCadMov> = ({
  onClose,
  idConta,
  buscaMovimentacoes,
  setContaBancaria,
}) => {
  const getNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const buscaContas = async () => {
    let resposta = await api<ContaResponse>(
      `/ContasUsuarios?id=${idConta}`,
      "GET",
      undefined,
      true,
    );

    console.log(resposta);

    if (resposta.sucesso && resposta.dados) {
      setContaBancaria(resposta.dados.conteudo[0]);
    }
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

  const handleValor = (value: string) => {
    const numeros = value.replace(/\D/g, "");
    const valorNumerico = Number(numeros) / 100;
    const formatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorNumerico);
    setValorFormatado(formatado);
    setValor(valorNumerico);
  };

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
        buscaContas();
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
    <form className="centraliza" onSubmit={criaMov}>
      <div className="modal-header">
        <h2>Nova Transação</h2>
      </div>

      <div className="modal-body">
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

        <div className="input-group">
          <label>Título</label>
          <input
            type="text"
            value={titulo}
            maxLength={80}
            placeholder="Ex: Mercado"
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Descrição</label>
          <input
            type="text"
            placeholder="Ex: Compra do mês"
            value={descricao}
            maxLength={255}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Valor (R$)</label>
          <input
            type="text"
            maxLength={25}
            value={valorFormatado}
            onChange={(e) => handleValor(e.target.value)}
            placeholder="R$ 0,00"
            required
          />
        </div>

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
              <option key={categoria.idCategoria} value={categoria.idCategoria}>
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

        {erroMsg && <p className="error">{erroMsg}</p>}

        <button type="submit" className="botão-transação" disabled={isLoading}>
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </div>
    </form>
  );
};

export default CadMov;
