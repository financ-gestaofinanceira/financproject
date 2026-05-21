import React, { useContext, useState } from "react";
import TitleText from "../../../props/TitleText/TitleText";
import InputText from "../../../props/InputText/InputText";
import { TypeText } from "../../../props/InputText/TypeText";
import InputSelect from "../../../props/InputSelect/InputSelect";
import FncButton from "../../../props/FncButton/FncButton";
import InputCheckBox from "../../../props/InputCheckBox/InputCheckBox";
import api from "../../../services/api/apiConnect";
import { ContaContext } from "../../../contexts/ContaContext";
import ErrorText from "../../../props/ErrorText/ErrorText";

type ConviteCadastroResponse = {
  valor: ConviteCadastroValor;
};

type ConviteCadastroValor = {
  idConvite: number;
  permissao: number;
};

type ConviteCadastroRequest = {
  idConta: number;
  emailDestinatario: string;
  acesso: number;
  expiracaoContaUsuario?: number | null;
};

type PropCadConvite = {
  setIsCadInvite: (value: boolean) => void;
};

const CadConvite: React.FC<PropCadConvite> = ({ setIsCadInvite }) => {
  const { conta } = useContext(ContaContext);
  const [email, setEmail] = useState("");
  const [acesso, setAcesso] = useState<number>(1);
  const [checkExpiracao, setCheckExpiracao] = useState(false);
  const [tempoExpiracao, setTempoExpiracao] = useState<string>("15");
  const [msgError, setMsgError] = useState<string | null>(null);

  const cadastrarConvite = async () => {
    try {
      if (!email) {
        setMsgError("O email é obrigatório.");
        return;
      }
      let request: ConviteCadastroRequest = {
        acesso: acesso,
        emailDestinatario: email,
        idConta: conta!.idConta,
        expiracaoContaUsuario:
          checkExpiracao === true ? parseInt(tempoExpiracao) : null,
      };

      const resposta = await api<ConviteCadastroResponse>(
        `/Convites`,
        "POST",
        request,
      );
      if (resposta.sucesso && resposta.dados) {
        setIsCadInvite(false);
      } else {
        setMsgError(resposta!.erro!);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  return (
    <>
      <TitleText text="Cadastro de Convite" />
      <InputText
        label="Email do usuário"
        text={email}
        placeholder="convidado@email.com"
        setText={setEmail}
        maxLenght={100}
        type={TypeText.Text}
      />

      <InputSelect
        label="Permissão"
        opcoes={[
          { label: "Administrador", value: "1" },
          { label: "Visualizador", value: "2" },
          { label: "Mestre", value: "0" },
        ]}
        onChange={(valor) => setAcesso(parseInt(valor))}
      />

      <InputCheckBox
        label="Tempo de expiração"
        checked={checkExpiracao}
        setChecked={setCheckExpiracao}
      />

      {checkExpiracao && (
        <InputText
          label="Tempo de expiração em minutos"
          text={tempoExpiracao}
          setText={setTempoExpiracao}
          type={TypeText.Number}
        />
      )}
      {msgError && <ErrorText text={msgError} />}

      <FncButton title="Cadastrar" onClick={cadastrarConvite} />
    </>
  );
};

export default CadConvite;
