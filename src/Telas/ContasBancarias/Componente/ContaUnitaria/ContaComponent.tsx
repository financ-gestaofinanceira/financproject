import { useContext } from "react";
import { ContaContext } from "../../../../contexts/ContaContext";
import type { ContaBancaria } from "../../../../models/ContasUsuarios/GetContasBancarias";
import api from "../../../../services/api/apiConnect";
import "./ContaComponentStyle.css";

type Props = {
  setTelaAtual: React.Dispatch<React.SetStateAction<number>>;
  conta: ContaBancaria;
  buscaContas: () => void;
};

const ContaComponent: React.FC<Props> = ({
  setTelaAtual,
  conta,
  buscaContas,
}) => {
  const formatarData = (dataUtc: string) => {
    const data = new Date(dataUtc);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const min = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  };

  function getTextColor(bgColor: string) {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);

    // fórmula de luminância simplificada
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 186 ? "#292a2b" : "#FFFFFF";
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
              style={{ fontSize: "14px", color: getTextColor(conta.cor) }}
            >
              arrow_upward
            </span>
          </div>
          <div className="stat-info">
            <p style={{ color: getTextColor(conta.cor) }}>Receitas</p>
            <h2 style={{ color: getTextColor(conta.cor) }}>
              {formataMoeda(conta.entradaPendente)}
            </h2>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <span
              className="material-icons"
              style={{ fontSize: "14px", color: getTextColor(conta.cor) }}
            >
              arrow_downward
            </span>
          </div>
          <div className="stat-info">
            <p style={{ color: getTextColor(conta.cor) }}>Despesas</p>
            <h2 style={{ color: getTextColor(conta.cor) }}>
              {formataMoeda(conta.saidaPendente)}
            </h2>
          </div>
        </div>
      </div>
    );
  };

  const favoritarConta = async () => {
    await api<string>(`/ContasUsuarios/${conta?.idConta}/Favorita`, "POST");
  };

  const { setConta } = useContext(ContaContext);

  return (
    <>
      <div
        className="card-secundario-custom"
        style={{ background: conta?.cor }}
        onClick={() => {
          if (conta?.status == 0) {
            setTelaAtual(1);
            setConta(conta);
          }
        }}
      >
        <div className="card-secundario__header">
          <div className="fnc-ctn-icons icon-corrente">
            <span
              className="material-icons"
              style={{ color: getTextColor(conta.cor) }}
            >
              account_balance_wallet
            </span>

            <span
              style={conta.contaFavorita ? { color: "#e2c20c" } : undefined}
              className="material-icons icon-favorite"
              onClick={async (e) => {
                e.stopPropagation();

                await favoritarConta();
                await buscaContas();
              }}
            >
              star
            </span>
          </div>
        </div>
        <div className="card-secundario__label">
          <p style={{ color: getTextColor(conta.cor) }}>{conta?.titulo}</p>
          {conta.expiracao && (
            <p style={{ color: getTextColor(conta.cor) }}>
              Válida até {formatarData(conta.expiracao)}
            </p>
          )}
        </div>
        <div className="card-secundario__valor">
          <p
            style={{
              textDecoration: conta?.status !== 0 ? "line-through" : "none",
              color: conta?.status !== 0 ? "#d6d6da" : getTextColor(conta.cor),
            }}
          >
            {formataMoeda(conta?.saldoAtual!)}
          </p>
        </div>
        <div className="card-footer-info">
          <div
            className="footer-label"
            style={{ color: getTextColor(conta.cor) }}
          >
            <span className="material-icons" style={{ fontSize: "12px" }}>
              account_balance
            </span>
            Corrente
          </div>
          <div className="status-dot dot-blue"></div>
        </div>

        {conta?.status === 0 && !conta?.expirado && retornaReceitas()}
      </div>
    </>
  );
};

export default ContaComponent;
