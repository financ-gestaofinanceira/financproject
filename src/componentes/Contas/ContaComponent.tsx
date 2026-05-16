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
  function getTextColor(bgColor: string) {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);

    // fórmula de luminância simplificada
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 186 ? "#000000" : "#FFFFFF";
  }
  const formataMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };
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
            <h2>{formataMoeda(contaBancaria.entradaPendente)}</h2>
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
            <h2>{formataMoeda(contaBancaria.saidaPendente)}</h2>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div
        className="card-secundario-custom"
        style={{ background: contaBancaria.cor }}
        onClick={() => {
          if (contaBancaria.status == 0) {
            setTelaAtual(1);
            setContaBancariaSelecionada(contaBancaria);
          }
        }}
      >
        <div className="card-secundario__header">
          <div className="card-secundario__icon icon-corrente">
            <span className="material-icons">account_balance_wallet</span>
          </div>
        </div>
        <div className="card-secundario__label">
          <p style={{ color: getTextColor(contaBancaria.cor) }}>
            {contaBancaria.titulo}
          </p>
        </div>
        <div className="card-secundario__valor">
          <p
            style={{
              textDecoration:
                contaBancaria.status !== 0 ? "line-through" : "none",
              color: contaBancaria.status !== 0 ? "#d6d6da" : "white",
            }}
          >
            {formataMoeda(contaBancaria.saldoAtual)}
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
