import React, { useState } from "react";
import api from "../../services/api/apiConnect";
import TitleText from "../../props/TitleText/TitleText";
import SubtitleText from "../../props/SubtitleText/SubtitleText";
import InputText from "../../props/InputText/InputText";
import { TypeText } from "../../props/InputText/TypeText";
import "./RegistrarUsuarioStyle.css";
import SubtitleInteractive from "../../props/SubtitleInteractive/SubtitleInteractive";
import FncButton from "../../props/FncButton/FncButton";
import { TypeButton } from "../../props/FncButton/TypeButton";
import ErrorText from "../../props/ErrorText/ErrorText";
import InputCheckBox from "../../props/InputCheckBox/InputCheckBox";

interface RegisterProps {
  exibeCadastro: Boolean;
  setExibeCadastro: React.Dispatch<React.SetStateAction<boolean>>;
}

type registesUser = {
  primeiroNome: string;
  segundoNome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

const RegistrarUsuarioComponente: React.FC<RegisterProps> = ({
  setExibeCadastro,
}) => {
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);
  const [primeiroNome, setPrimeiroNome] = useState<string>("");
  const [segundoNome, setSegundoNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmaSenha, setConfirmaSenha] = useState<string>("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const cadastraUsuario = async () => {
    if (!primeiroNome || !segundoNome || !email || !senha || !confirmaSenha) {
      setErroMsg("Preencha todos os campos");
      return;
    }

    if (senha !== confirmaSenha) {
      setErroMsg("As senhas não coincidem");
      return;
    }

    const request: registesUser = {
      primeiroNome,
      segundoNome,
      email,
      senha,
      confirmarSenha: confirmaSenha,
    };

    const retorno = await api<string>("Usuarios/registrar", "POST", request);

    if (!retorno.sucesso) {
      setErroMsg(retorno.erro);
    } else {
      setErroMsg(undefined);
      setExibeCadastro(false);
    }
  };

  return (
    <div className="login-box">
      <div className="fnc-reguser-title">
        <TitleText text="Vamos começar!" />
        <SubtitleText text="O primeiro passo para sua educação financeira!" />
      </div>

      <div className="fnc-form-register">
        <div className="row">
          <InputText
            label="Primeiro Nome"
            text={primeiroNome}
            placeholder="Primeiro nome"
            type={TypeText.Text}
            setText={setPrimeiroNome}
          />
          <InputText
            label="Sobrenome"
            text={segundoNome}
            placeholder="Sobrenome"
            type={TypeText.Text}
            setText={setSegundoNome}
          />
          <InputText
            label="Email"
            text={email}
            placeholder="seu@email.com"
            type={TypeText.Email}
            setText={setEmail}
          />
          <InputText
            label="Senha"
            text={senha}
            placeholder="••••••••"
            type={mostrarSenha ? TypeText.Text : TypeText.Password}
            setText={setSenha}
          />
          <InputText
            label="Confirmar Senha"
            text={confirmaSenha}
            placeholder="••••••••"
            type={mostrarSenha ? TypeText.Text : TypeText.Password}
            setText={setConfirmaSenha}
          />
          <InputCheckBox
            label="Mostrar senha"
            checked={mostrarSenha}
            setChecked={setMostrarSenha}
          />
        </div>
        <FncButton
          type={TypeButton.Button}
          onClick={cadastraUsuario}
          title="Criar conta"
        />
      </div>

      {erroMsg && <ErrorText text={erroMsg} />}

      <SubtitleInteractive
        subtitle="Já tem conta?"
        textInteractive="Fazer login"
        color="#155dfc"
        onClick={() => setExibeCadastro(false)}
      />
    </div>
  );
};

export default RegistrarUsuarioComponente;
