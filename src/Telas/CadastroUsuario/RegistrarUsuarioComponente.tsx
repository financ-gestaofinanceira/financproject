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

  const cadastraUsuario = async () => {
    if (!primeiroNome || !segundoNome || !email || !senha || !confirmaSenha) {
      setErroMsg("Preencha todos os campos");
      return;
    }

    console.log("Usuário cadastrado");

    const request: registesUser = {
      primeiroNome: primeiroNome,
      segundoNome: segundoNome,
      email: email,
      senha: senha,
      confirmarSenha: confirmaSenha,
    };
    console.log(request);
    var retorno = await api<string>("Usuarios/registrar", "POST", request);
    if (!retorno.sucesso) setErroMsg(retorno.erro);
    else {
      setErroMsg(undefined);
      setExibeCadastro(false);
    }
    console.log(retorno);
  };

  return (
    <div className="login-box">
      <div className="fnc-reguser-title">
        <TitleText text="Vamos começar!" />
        <SubtitleText text="O primeiro passo para sua educação financeira!" />
      </div>

      <form className="fnc-form-register" onSubmit={cadastraUsuario}>
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
            type={TypeText.Password}
            setText={setSenha}
          />
          <InputText
            label="Confirmar Senha"
            text={confirmaSenha}
            placeholder="••••••••"
            type={TypeText.Password}
            setText={setConfirmaSenha}
          />
        </div>
        <FncButton type={TypeButton.Submit} title="Criar conta" />
      </form>

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
