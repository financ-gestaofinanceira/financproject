import type { GetContasUsuarios } from "../../models/ContasUsuarios/GetContasUsuarios";

type Props = {
  contaBancaria: GetContasUsuarios[];
};

const ContaPrincipalComponent: React.FC<Props> = ({ contaBancaria }) => {
  contaBancaria.map((conta) => console.log(conta));
  return (
    <>
      <div className="card-patrimonio">
        <div className="patrimonio-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-icons" style={{ fontSize: "18px" }}>
              account_balance
            </span>
            <p>Patrimônio Total</p>
          </div>
          <span className="material-icons" style={{ fontSize: "18px" }}>
            visibility
          </span>
        </div>
        <div className="patrimonio-valor">
          <p
            style={{
              color: "white",
            }}
          >
            R$ 42.455,00
          </p>
        </div>
        <div className="patrimonio-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <span
                className="material-icons"
                style={{ fontSize: "14px", color: "white" }}
              >
                arrow_upward
              </span>
            </div>
            <div className="stat-info">
              <p>Receitas</p>
              <h2>R$ 11.710,00</h2>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <span
                className="material-icons"
                style={{ fontSize: "14px", color: "white" }}
              >
                arrow_downward
              </span>
            </div>
            <div className="stat-info">
              <p>Despesas</p>
              <h2>R$ 4.364,50</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContaPrincipalComponent;
