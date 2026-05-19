import type {
  ContaResponse,
  ContaBancaria,
} from "../../models/ContasUsuarios/GetContasUsuarios";
import api from "../../services/api/apiConnect";

import { useContext, useEffect, useState } from "react";
import Modal from "../../componentes/Modal/Modal";

import LandBotComponent from "../../componentes/LandBot/LandBotComponent";
import FncButton from "../../props/FncButton/FncButton";
import TitleText from "../../props/TitleText/TitleText";
import SubtitleText from "../../props/SubtitleText/SubtitleText";
import CadContas from "./CadConta/CadContas";
import PatrimonioTotal from "./Componente/Patrimonio/PatrimonioTotal";
import ContaComponent from "./Componente/ContaUnitaria/ContaComponent";
import { AuthContext } from "../../contexts/AuthContext";
import Carregamento from "../../componentes/Carregamento/Carregamento";
import LabelText from "../../props/LabelText/LabelText";
import MsgTextBox from "../../props/TextBox/MsgTextBox";
import MsgBox from "../../props/MsgBox/MsgBox";
import { TypeMsgBox } from "../../props/MsgBox/TypeMsgBox";

type Props = {
  setTelaAtual: React.Dispatch<React.SetStateAction<number>>;
};

const Contas: React.FC<Props> = ({ setTelaAtual }) => {
  const { user } = useContext(AuthContext);
  const [contasObtidas, setcontasObtidas] = useState<ContaResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<Boolean>(false);
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
    setLoading(true);
    let resposta = await api<ContaResponse>("/ContasUsuarios", "GET");

    if (resposta.sucesso && resposta.dados) {
      setcontasObtidas(resposta.dados);
    }
    setLoading(false);
  };

  useEffect(() => {
    buscaContas();
  }, []);

  return (
    <>
      {user !== null && <LandBotComponent usuario={user} />}
      {loading ? (
        <Carregamento />
      ) : (
        <>
          <div className="menu-superior">
            <div className="texto-superior">
              <LabelText text={retornaBoasVindas()} />
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
                  conta={conta}
                  buscaContas={buscaContas}
                />
              ))}
            </div>

            <Modal
              isOpen={isCadContaOpen}
              onClose={() => setIsCadContaOpen(false)}
            >
              <CadContas
                buscaContas={buscaContas}
                onClose={() => setIsCadContaOpen(false)}
              />
            </Modal>
          </div>
        </>
      )}
    </>
  );
};

export default Contas;
