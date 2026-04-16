import type { GetMovimentacoes } from "../../models/Movimentacoes/GetMovimentacoes";
import "./TabelaMovimentacao.css";

type PropMov = {
  movimentacao: GetMovimentacoes;
};

const TabelaMovimentacao: React.FC<PropMov> = ({ movimentacao }) => {
  const formataMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formataData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <h2 className="titulo-secao">Movimentações</h2>
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
            {movimentacao?.conteudo?.movimentacaos?.map((mov) => (
              <tr className="tabela-row" key={mov.id}>
                <td>{mov.titulo}</td>

                <td>
                  {typeof mov.categoria === "object"
                    ? "Sem categoria"
                    : (mov.categoria ?? "Sem categoria")}
                </td>

                <td>{formataData(mov.dthrMovimentacao)}</td>

                <td
                  className={
                    mov.tipo === 0 ? "valor-positivo" : "valor-negativo"
                  }
                >
                  <p
                    className={
                      mov.tipo === 0 ? "valor-positivo" : "valor-negativo"
                    }
                  >
                    {" "}
                    {formataMoeda(mov.valor)}
                  </p>
                </td>

                <td>{mov.concluido ? "Concluido" : "Pendente"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaMovimentacao;
