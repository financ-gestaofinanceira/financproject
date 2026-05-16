import { useState } from "react";
import type {
  GetMovimentacoes,
  Movimentacao,
} from "../../../models/Movimentacoes/GetMovimentacoes";
import ConclusaoMovimentacao from "../Confirmacao/ConclusaoMovimentacao";
import "./TabelaMovimentacao.css";
import Modal from "../../../componentes/Modal/Modal";

type PropMov = {
  idConta: number;
  movimentacao: GetMovimentacoes;
  buscaMovimentacoes: () => void;
};

const TabelaMovimentacao: React.FC<PropMov> = ({
  idConta,
  movimentacao,
  buscaMovimentacoes,
}) => {
  const [movSelecionada, setMovSelecionada] = useState<Movimentacao | null>();
  const [isAlterMovOpen, setIsAlterMovOpen] = useState(false);

  const formataMoeda = (valor: number, movTipo: number) => {
    let moeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

    return (
      <p className={movTipo === 0 ? "valor-positivo" : "valor-negativo"}>
        {moeda}
      </p>
    );
  };

  const formataData = (data: string) => {
    return `${new Date(data).toLocaleDateString("pt-BR")} ${new Date(data).toLocaleTimeString("pt-BR")}`;
  };

  function getTextColor(bgColor: string) {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);

    // fórmula de luminância simplificada
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 186 ? "#000000" : "#FFFFFF";
  }

  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <h2 className="titulo-secao">Movimentações</h2>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>TITULO</th>
              <th>OBSERVACAO</th>
              <th>CATEGORIA</th>
              <th>DATA MOV</th>
              <th>VALOR</th>
              <th>STATUS</th>
              <th>DATA CONCLUSÃO</th>
              <th>USU CAD</th>
              <th>USU EXE</th>
            </tr>
          </thead>
          <tbody>
            {movimentacao?.conteudo?.movimentacaos?.map((mov) => (
              <tr
                key={mov.id}
                onClick={() => {
                  setMovSelecionada(mov);
                  setIsAlterMovOpen(true);
                  console.log(mov);
                }}
              >
                <td>{mov.titulo}</td>
                <td>{mov.observacao}</td>
                <td>
                  {mov.categoria !== null && (
                    <div
                      className="categoria"
                      style={{ background: mov.categoria.cor }}
                    >
                      <p style={{ color: getTextColor(mov.categoria.cor) }}>
                        {mov.categoria?.nome}
                      </p>
                    </div>
                  )}
                </td>
                <td>{formataData(mov.dthrMovimentacao)}</td>
                <td>{formataMoeda(mov.valor, mov.tipo)}</td>
                <td>{mov.concluido ? "Concluido" : "Pendente"}</td>
                <td>
                  {mov.dthrConclusao !== null && formataData(mov.dthrConclusao)}
                </td>

                <td>{mov.usarioCriador.email}</td>
                <td>{mov.usuarioExecutor?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAlterMovOpen && movSelecionada && (
        <Modal isOpen={isAlterMovOpen} onClose={() => setIsAlterMovOpen(false)}>
          <ConclusaoMovimentacao
            onClose={() => setIsAlterMovOpen(false)}
            buscaMovimentacoes={buscaMovimentacoes}
            idConta={idConta}
            movimentacaoSelecionada={movSelecionada}
          />
        </Modal>
      )}
    </div>
  );
};

export default TabelaMovimentacao;
