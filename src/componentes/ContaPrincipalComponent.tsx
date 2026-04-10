import type { GetContasUsuarios } from "../models/ContasUsuarios/GetContasUsuarios";

type Props = {
  contaBancaria: GetContasUsuarios;
};

const ContaPrincipalComponent: React.FC<Props> = ({ contaBancaria }) => {
  return (
    <>
      <div
        className={
          contaBancaria.status === 0
            ? "card-patrimonio"
            : "card-patrimonio-inativo"
        }
      >
        <div className="patrimonio-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-icons" style={{ fontSize: "18px" }}>
              account_balance
            </span>
            <p
              style={{
                textDecoration:
                  contaBancaria.status !== 0 ? "line-through" : "none",
              }}
            >
              {contaBancaria.titulo}
            </p>
          </div>
          <span className="material-icons" style={{ fontSize: "18px" }}>
            visibility
          </span>
        </div>
        <div className="patrimonio-valor">
          <p
            style={{
              textDecoration:
                contaBancaria.status !== 0 ? "line-through" : "none",
              color: contaBancaria.status !== 0 ? "#d6d6da" : "white",
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
