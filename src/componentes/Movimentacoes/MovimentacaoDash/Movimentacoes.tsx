import type { GetContasUsuarios } from "../../../models/ContasUsuarios/GetContasUsuarios";
import TabelaMovimentacao from "../TabelaMovimentacao";
import "./MovimentacaoesStyle.css";
type Props = {
  contaBancaria: GetContasUsuarios;
};
const Movimentacoes: React.FC<Props> = ({ contaBancaria }) => {
  return (
    <>
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
              <div className="card-secundario__icon icon-receita">
                <span className="material-icons">trending_up</span>
              </div>
            </div>
            <div className="card-secundario__label">Receitas</div>
            <div
              className="card-secundario__valor"
              style={{ color: "#00D492" }}
            >
              R$ 11.710,00
            </div>
          </div>

          <div className="card-secundario">
            <div className="card-secundario__header">
              <div className="card-secundario__icon icon-despesa">
                <span className="material-icons">trending_down</span>
              </div>
            </div>
            <div className="card-secundario__label">Despesas</div>
            <div
              className="card-secundario__valor"
              style={{ color: "#FF4B4B" }}
            >
              R$ 4.364,50
            </div>
          </div>

          <div className="card-secundario">
            <div className="card-secundario__header">
              <div className="card-secundario__icon icon-investimento">
                <span className="material-icons">account_balance</span>
              </div>
            </div>
            <div className="card-secundario__label">Balanço</div>
            <div
              className="card-secundario__valor"
              style={{ color: "#2B7FFF;" }}
            >
              R$ 7.345,50
            </div>
          </div>
        </div>

        <TabelaMovimentacao />
      </div>
    </>
  );
};

export default Movimentacoes;
