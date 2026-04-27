import type {
  ContaResponse,
  GetContasUsuarios,
} from "../../models/ContasUsuarios/GetContasUsuarios";
import TabelaMovimentacao from "../../componentes/Movimentacoes/tabela/TabelaMovimentacao";
import api from "../../services/api/apiConnect";

import "./MovimentacaoesStyle.css";
import { useCallback, useEffect, useState } from "react";
import type { GetMovimentacoes } from "../../models/Movimentacoes/GetMovimentacoes";
import Modal from "../../componentes/Modal/Modal";
import CadMov from "../../componentes/Movimentacoes/CadMov/CadMov";
import type { UsuarioResponse } from "../../models/Usuario/UsuarioResponse";
import Categorias from "../../componentes/categoria/Categorias";
import type { CategoriaResponse } from "../../models/Categorias/Categorias";

type Props = {
  contaBancaria: GetContasUsuarios;
  usuario: UsuarioResponse;
  setContaBancaria: React.Dispatch<
    React.SetStateAction<GetContasUsuarios | undefined>
  >;
};

const Movimentacoes: React.FC<Props> = ({
  contaBancaria,
  setContaBancaria,
}) => {
  const [movimentacoes, setMovimentacoes] = useState<GetMovimentacoes>();
  const [isCadMovOpen, setIsCadMovOpen] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);

  // Helper para datas
  const getNow = (isEnd: boolean = false) => {
    const now = new Date();
    let date: Date;

    if (!isEnd) {
      date = new Date(now.getFullYear(), now.getMonth(), 1);
      date.setHours(0, 0, 0, 0);
    } else {
      date = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      date.setHours(23, 59, 59, 999);
    }

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const [dataInicial, setDataInicial] = useState(getNow(false));
  const [dataFinal, setDataFinal] = useState(getNow(true));

  const formataMoeda = (valor: number | undefined) => {
    if (valor === undefined) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // 1. Busca de Categorias (Memorizada)
  const buscaCategorias = useCallback(async () => {
    try {
      const resposta = await api<CategoriaResponse>(
        `/Contas/${contaBancaria.idConta}/Categorias`,
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
  }, [contaBancaria.idConta]);

  // 2. Busca de Dados da Conta (Saldos no topo)
  const buscaDadosConta = useCallback(async () => {
    try {
      const resposta = await api<ContaResponse>(
        `/ContasUsuarios?id=${contaBancaria.idConta}`,
        "GET",
        undefined,
        true,
      );
      if (resposta.sucesso && resposta.dados?.conteudo?.[0]) {
        setContaBancaria(resposta.dados.conteudo[0]);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados da conta:", error);
    }
  }, [contaBancaria.idConta, setContaBancaria]);

  // 3. Busca de Movimentações (Memorizada)
  const buscaMovimentacoes = useCallback(async () => {
    const toUTCISOString = (data: string) => new Date(data).toISOString();

    // Incluímos o categoriaId na query caso ele exista
    const url = `/Contas/${contaBancaria.idConta}/Movimentacoes/Retornar?DthrMovimentacaoInicial=${toUTCISOString(dataInicial)}&DthrMovimentacaoFinal=${toUTCISOString(dataFinal)}${categoriaId ? `&IdCategoria=${categoriaId}` : ""}`;

    try {
      const resposta = await api<GetMovimentacoes>(url, "GET", undefined, true);
      if (resposta.sucesso && resposta.dados) {
        setMovimentacoes(resposta.dados);
      }
      // Atualiza os saldos do topo também
      buscaDadosConta();
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
    }
  }, [
    contaBancaria.idConta,
    dataInicial,
    dataFinal,
    categoriaId,
    buscaDadosConta,
  ]);

  // Efeito principal: Carrega categorias e movimentações
  useEffect(() => {
    buscaCategorias();
    buscaMovimentacoes();
  }, [buscaCategorias, buscaMovimentacoes]);

  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <div className="texto-superior">
          <p>Gerencie todas as suas movimentações</p>
          <h1>Transações - {contaBancaria.titulo}</h1>
        </div>

        <div className="transacoes-actions">
          <button
            className="botão-transação"
            onClick={() => setIsCategoriaOpen(true)}
          >
            Categorias
          </button>
          <button
            className="botão-transação"
            onClick={() => setIsCadMovOpen(true)}
          >
            Nova Transação
          </button>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-investimento">
              <span className="material-icons">account_balance</span>
            </div>
          </div>
          <div className="card-secundario__label">Saldo atual</div>
          <div className="card-secundario__valor" style={{ color: "#2B7FFF" }}>
            {formataMoeda(contaBancaria.saldoAtual)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-investimento">
              <span className="material-icons">account_balance</span>
            </div>
          </div>
          <div className="card-secundario__label">Saldo Projetado</div>
          <div className="card-secundario__valor" style={{ color: "#0c42f5" }}>
            {formataMoeda(contaBancaria.saldoProjetado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-receita">
              <span className="material-icons">trending_up</span>
            </div>
          </div>
          <div className="card-secundario__label">Receitas</div>
          <div className="card-secundario__valor" style={{ color: "#00D492" }}>
            {formataMoeda(contaBancaria.entradaPendente)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-despesa">
              <span className="material-icons">trending_down</span>
            </div>
          </div>
          <div className="card-secundario__label">Despesas</div>
          <div className="card-secundario__valor" style={{ color: "#FF4B4B" }}>
            {formataMoeda(contaBancaria.saidaPendente)}
          </div>
        </div>
      </div>

      <hr />

      <div className="grid-cards">
        <div className="card-secundario">
          <div className="card-secundario__label">Saldo no período</div>
          <div className="card-secundario__valor" style={{ color: "#2B7FFF" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.saldoRealizado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Saldo no projetado</div>
          <div className="card-secundario__valor" style={{ color: "#2B7FFF" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.saldoProjetado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Receitas no período</div>
          <div className="card-secundario__valor" style={{ color: "#00D492" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.entrada.projetado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Despesas no período</div>
          <div className="card-secundario__valor" style={{ color: "#FF4B4B" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.saida.projetado)}
          </div>
        </div>
      </div>

      <Modal isOpen={isCadMovOpen} onClose={() => setIsCadMovOpen(false)}>
        <CadMov
          onClose={() => setIsCadMovOpen(false)}
          idConta={contaBancaria.idConta}
          buscaMovimentacoes={buscaMovimentacoes}
        />
      </Modal>

      <Modal isOpen={isCategoriaOpen} onClose={() => setIsCategoriaOpen(false)}>
        <Categorias
          idConta={contaBancaria.idConta}
          buscaMovimentacoes={buscaMovimentacoes}
        />
      </Modal>

      <div className="ctn-vertical-dt">
        <div className="input-group">
          <label>Data inicial</label>
          <input
            type="datetime-local"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Data Final</label>
          <input
            type="datetime-local"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Categoria</label>
          <select
            value={categoriaId ?? ""}
            onChange={(e) =>
              setCategoriaId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Todas as categorias</option>
            {categorias?.conteudo.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {movimentacoes && (
        <TabelaMovimentacao
          movimentacao={movimentacoes}
          buscaMovimentacoes={buscaMovimentacoes}
          idConta={contaBancaria.idConta}
        />
      )}
    </div>
  );
};

export default Movimentacoes;
