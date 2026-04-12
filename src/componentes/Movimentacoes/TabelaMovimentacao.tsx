import "./TabelaMovimentacao.css";

const TabelaMovimentacao = () => {
  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <h2 className="titulo-secao">Movimentações</h2>
        <div className="transacoes-actions"></div>
      </div>

      <div className="tabela-container">
        <table className="tabela-movimentacao">
          <thead>
            <tr className="tabela-header">
              <th>TRANSAÇÃO</th>
              <th>CATEGORIA</th>
              <th>DATA</th>
              <th>VALOR</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tabela-row">
              <td>Salário Mensal</td>
              <td>Trabalho</td>
              <td>05/04/2026</td>
              <td className="valor-positivo">R$ 5.000,00</td>
            </tr>
            <tr className="tabela-row">
              <td>Assinatura Streaming</td>
              <td>Lazer</td>
              <td>06/04/2026</td>
              <td className="valor-negativo">- R$ 55,90</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaMovimentacao;
