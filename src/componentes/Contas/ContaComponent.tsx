import type { GetContasUsuarios } from "../../models/ContasUsuarios/GetContasUsuarios";

type Props = {
  setTelaAtual: React.Dispatch<React.SetStateAction<number>>;
  setContaBancariaSelecionada: React.Dispatch<
    React.SetStateAction<GetContasUsuarios | undefined>
  >;

  contaBancaria: GetContasUsuarios;
};

const ContaComponent: React.FC<Props> = ({
  setTelaAtual,
  setContaBancariaSelecionada,
  contaBancaria,
}) => {
  const retornaReceitas = () => {
    return (
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
            <p>Receitas</p>
            <h2>R$ 11.710,00</h2>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="card-secundario"
        onClick={() => {
          setTelaAtual(2);
          setContaBancariaSelecionada(contaBancaria);
        }}
      >
        <div className="card-secundario__header">
          <div className="card-secundario__icon icon-corrente">
            <span className="material-icons">account_balance_wallet</span>
          </div>
        </div>
        <div className="card-secundario__label">
          <p>{contaBancaria.titulo}</p>
        </div>
        <div className="card-secundario__valor">
          <p
            style={{
              textDecoration:
                contaBancaria.status !== 0 ? "line-through" : "none",
              color: contaBancaria.status !== 0 ? "#d6d6da" : "white",
            }}
          >
            R$ 4.255,00
          </p>
        </div>
        <div className="card-footer-info">
          <div className="footer-label">
            <span className="material-icons" style={{ fontSize: "12px" }}>
              account_balance
            </span>
            Corrente
          </div>
          <div className="status-dot dot-blue"></div>
        </div>

        {contaBancaria.status === 0 &&
          !contaBancaria.expirado &&
          retornaReceitas()}
      </div>
    </>
  );
};

export default ContaComponent;
