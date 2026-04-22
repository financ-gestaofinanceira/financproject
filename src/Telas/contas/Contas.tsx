import type {
  ContaResponse,
  GetContasUsuarios,
} from "../../models/ContasUsuarios/GetContasUsuarios";
import api from "../../services/api/apiConnect";

import "../movimentacoes/MovimentacaoesStyle.css";
import { useEffect, useState } from "react";
import Modal from "../../componentes/Modal/Modal";
import type { UsuarioResponse } from "../../models/Usuario/UsuarioResponse";
import LandBotComponent from "../../componentes/LandBot/LandBotComponent";
import PatrimonioTotal from "../../componentes/Contas/Patrimonio/PatrimonioTotal";
import ContaComponent from "../../componentes/Contas/ContaComponent";
import CadContas from "../../componentes/Contas/CadConta/CadContas";

type Props = {
  usuario: UsuarioResponse;
  setTelaAtual: React.Dispatch<React.SetStateAction<number>>;
  usaRefresh: () => void;
  contaBancaria: React.Dispatch<
    React.SetStateAction<GetContasUsuarios | undefined>
  >;
};

const Contas: React.FC<Props> = ({
  usuario,
  setTelaAtual,
  usaRefresh,
  contaBancaria,
}) => {
  const [contasObtidas, setcontasObtidas] = useState<ContaResponse | null>(
    null,
  );
  const [isCadContaOpen, setIsCadContaOpen] = useState(false);

  const retornaBoasVindas = () => {
    const hora = new Date().getHours();
    if (hora >= 22 && hora <= 3)
      return "Vá dormir! Você é corno 🐂 , não morcego... 🦇🦇";
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const buscaContas = async () => {
    let resposta = await api<ContaResponse>(
      "/ContasUsuarios",
      "GET",
      undefined,
      true,
    );

    console.log(resposta);

    if (resposta.sucesso && resposta.dados) {
      setcontasObtidas(resposta.dados);
    }
  };

  useEffect(() => {
    buscaContas();
  }, []);

  return (
    <>
      {usuario !== null && <LandBotComponent usuario={usuario} />}
      <div className="menu-superior">
        <div className="texto-superior">
          <p>{retornaBoasVindas()},</p>
          <h1>Minhas Contas</h1>
        </div>
        <button
          className="botão-transação"
          onClick={() => setIsCadContaOpen(true)}
        >
          + Nova Conta Bancaria
        </button>
      </div>
      <div className="principal">
        {contasObtidas?.conteudo !== undefined && (
          <PatrimonioTotal contaBancaria={contasObtidas?.conteudo} />
        )}
        <div className="grid-cards">
          {contasObtidas?.conteudo.map((conta) => (
            <ContaComponent
              key={conta.idConta}
              setTelaAtual={setTelaAtual}
              contaBancaria={conta}
              setContaBancariaSelecionada={contaBancaria}
            />
          ))}
        </div>

        <Modal isOpen={isCadContaOpen} onClose={() => setIsCadContaOpen(false)}>
          <CadContas
            usaRefresh={usaRefresh}
            buscaContas={buscaContas}
            onClose={() => setIsCadContaOpen(false)}
          />
        </Modal>
      </div>
    </>
  );
};

export default Contas;
