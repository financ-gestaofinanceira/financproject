import type { GetContasUsuarios } from "../../../models/ContasUsuarios/GetContasUsuarios";
import TabelaMovimentacao from "../TabelaMovimentacao";
import api from "../../../services/api/apiConnect";

import "./MovimentacaoesStyle.css";
import { useCallback, useEffect, useState } from "react";
import type { GetMovimentacoes } from "../../../models/Movimentacoes/GetMovimentacoes";

type Props = {
  contaBancaria: GetContasUsuarios;
};

const Movimentacoes: React.FC<Props> = ({ contaBancaria }) => {
  const [movimentacoes, setMovimentacoes] = useState<GetMovimentacoes>();

  const formataMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const buscaMovimentacoes = useCallback(async () => {
    const resposta = await api<GetMovimentacoes>(
      `/Contas/Movimentacoes/${contaBancaria.idConta}/Retornar?DthrMovimentacaoInicial=2020-04-01T20%3A13%3A16.3444041Z&DthrMovimentacaoFinal=2030-12-31T20%3A13%3A16.3444041Z`,
      "GET",
      undefined,
      true,
    );
    console.log(`/Contas/Movimentacoes/${contaBancaria.idConta}/Retornar`);

    console.log(resposta);
    if (resposta.sucesso && resposta.dados) {
      setMovimentacoes(resposta.dados);
    }
  }, [contaBancaria.idConta]);

  useEffect(() => {
    buscaMovimentacoes();
  }, [buscaMovimentacoes]);

  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <div className="texto-superior">
          <p>Gerencie todas as suas movimentações</p>
          <h1>Transações - {contaBancaria.titulo}</h1>
        </div>

        <div className="transacoes-actions">
          <button className="btn-exportar">Exportar</button>
          <button className="botão-transação">Nova</button>
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
            {formataMoeda(contaBancaria.saldoAtual)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Receitas no período</div>
          <div className="card-secundario__valor" style={{ color: "#00D492" }}>
            {formataMoeda(contaBancaria.entradaPendente)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Despesas no período</div>
          <div className="card-secundario__valor" style={{ color: "#FF4B4B" }}>
            {formataMoeda(contaBancaria.saidaPendente)}
          </div>
        </div>
      </div>

      {movimentacoes && <TabelaMovimentacao movimentacao={movimentacoes} />}
    </div>
  );
};

export default Movimentacoes;
