import { ConteudoContas } from "../../../../models/ContasUsuarios/GetContasBancarias";
import "./PatrimonioStyle.css";

type Props = {
  contaBancaria: ConteudoContas;
};

const ContaPrincipalComponent: React.FC<Props> = ({ contaBancaria }) => {
  const formataMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

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
        <p className="saldo_total">
          {formataMoeda(contaBancaria.saldoRealizado)}
        </p>
      </div>

      <div className="patrimonio-header">
        <div className="header-left">
          <p>Patrimônio Projetado</p>
        </div>
      </div>

      <div className="patrimonio-valor">
        <p className="saldo_total_projetado">
          {formataMoeda(contaBancaria.saldoProjetado)}
        </p>
      </div>

      <div className="patrimonio-stats">
        <div className="stat-item">
          <div className="stat-icon stat-up">
            <span className="material-icons icon-tiny">arrow_upward</span>
          </div>
          <div className="stat-info">
            <p>Receitas</p>
            <h2>{formataMoeda(contaBancaria.entradaPendente)}</h2>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon stat-down">
            <span className="material-icons icon-tiny">arrow_downward</span>
          </div>
          <div className="stat-info">
            <p>Despesas</p>
            <h2>{formataMoeda(contaBancaria.saidaPendente)}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContaPrincipalComponent;
