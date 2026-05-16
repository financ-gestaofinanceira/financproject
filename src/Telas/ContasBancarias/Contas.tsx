import type {
  ContaResponse,
  GetContasUsuarios,
} from "../../models/ContasUsuarios/GetContasUsuarios";
import api from "../../services/api/apiConnect";

import { useContext, useEffect, useState } from "react";
import Modal from "../../componentes/Modal/Modal";
import type { UsuarioResponse3 } from "../../models/Usuario/UsuarioResponse";
import LandBotComponent from "../../componentes/LandBot/LandBotComponent";
import FncButton from "../../refatoracao/props/FncButton/FncButton";
import { AuthContext } from "../../contexts/AuthContext";
import TitleText from "../../refatoracao/props/TitleText/TitleText";
import SubtitleText from "../../refatoracao/props/SubtitleText/SubtitleText";
import CadContas from "./CadConta/CadContas";
import PatrimonioTotal from "./Componente/Patrimonio/PatrimonioTotal";
import ContaComponent from "./Componente/ContaUnitaria/ContaComponent";

type Props = {
  usuario: UsuarioResponse3;
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
          <SubtitleText text={retornaBoasVindas()} />
          <TitleText text="Minhas Contas" />
        </div>
        <div>
          <FncButton
            title="Nova Conta Bancaria"
            onClick={() => setIsCadContaOpen(true)}
          />
        </div>
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
