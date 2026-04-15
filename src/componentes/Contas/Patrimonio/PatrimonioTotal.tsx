import type { GetContasUsuarios } from "../../../models/ContasUsuarios/GetContasUsuarios";
import "./PatrimonioStyle.css";

type Props = {
  contaBancaria: GetContasUsuarios[];
};

const ContaPrincipalComponent: React.FC<Props> = ({ contaBancaria }) => {
  const formataMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const saldoTotal = contaBancaria.reduce(
    (acc, conta) => acc + conta.saldoAtual,
    0,
  );

  const saldoTotalProjetado = contaBancaria.reduce(
    (acc, conta) => acc + conta.saldoProjetado,
    0,
  );

  const receitaTotal = contaBancaria.reduce(
    (acc, conta) => acc + conta.entradaPendente,
    0,
  );

  const despesaTotal = contaBancaria.reduce(
    (acc, conta) => acc + conta.saidaPendente,
    0,
  );

  return (
    <div className="card-patrimonio">
      <div className="patrimonio-header">
        <div className="header-left">
          <span className="material-icons icon-small">account_balance</span>
          <p>Patrimônio Total</p>
        </div>

        <span className="material-icons icon-small">visibility</span>
      </div>

      <div className="patrimonio-valor">
        <p className="saldo_total">{formataMoeda(saldoTotal)}</p>
      </div>

      <div className="patrimonio-header">
        <div className="header-left">
          <p>Patrimônio Projetado</p>
        </div>
      </div>

      <div className="patrimonio-valor">
        <p className="saldo_total_projetado">{formataMoeda(saldoTotalProjetado)}</p>
      </div>

      <div className="patrimonio-stats">
        <div className="stat-item">
          <div className="stat-icon stat-up">
            <span className="material-icons icon-tiny">arrow_upward</span>
          </div>
          <div className="stat-info">
            <p>Receitas</p>
            <h2>{formataMoeda(receitaTotal)}</h2>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon stat-down">
            <span className="material-icons icon-tiny">arrow_downward</span>
          </div>
          <div className="stat-info">
            <p>Despesas</p>
            <h2>{formataMoeda(despesaTotal)}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContaPrincipalComponent;
