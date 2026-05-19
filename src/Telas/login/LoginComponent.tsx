import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./LoginComponentStyle.css";
import { AuthContext, type TokenData } from "../../contexts/AuthContext";
import type { tokeRequest } from "../../models/Autenticação/tokenRequest";
import { GeraToken } from "../../services/auth/tokenService";
import TitleText from "../../props/TitleText/TitleText";
import SubtitleText from "../../props/SubtitleText/SubtitleText";
import InputText from "../../props/InputText/InputText";
import { TypeText } from "../../props/InputText/TypeText";
import FncButton from "../../props/FncButton/FncButton";
import { TypeButton } from "../../props/FncButton/TypeButton";
import ErrorText from "../../props/ErrorText/ErrorText";
import SubtitleInteractive from "../../props/SubtitleInteractive/SubtitleInteractive";
import MsgTextBox from "../../props/TextBox/MsgTextBox";

interface LoginProps {
  exibeCadastro: Boolean;
  setExibeCadastro: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginComponent: React.FC<LoginProps> = ({
  exibeCadastro,
  setExibeCadastro,
}) => {
  const { login, user } = useContext(AuthContext);

  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  useEffect(() => {
    console.log(user);

    if (user) {
      navigate("/home");
    }
  }, [user]);

  const navigate = useNavigate(); // Hook para navegação

  const reqApi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !senha) {
        setErroMsg("Preencha todos os campos");
        return;
      }

      const request: tokeRequest = {
        email: email,
        senha: senha,
      };

      const resposta = await GeraToken(request);
      if (resposta.erro) {
        console.log(resposta.erro);
        setErroMsg(resposta.erro);
        return;
      }

      const tokenObj: TokenData = {
        token: resposta!.dados!.token,
        expiration: resposta!.dados!.expiracao,
      };

      setErroMsg(null);
      login(tokenObj);
      navigate("/home");
    } catch (erro: any) {
      console.error(erro.message);
      setErroMsg(erro.message);
    }
  };

  return (
    <div className="login-box">
      <div className="fnc-login-title">
        <TitleText text="Bem-vindo" />
        <SubtitleText text="Entre na sua conta para continuar" />
      </div>

      <form className="fnc-form-login" onSubmit={reqApi}>
        <InputText
          label="Email"
          text={email}
          placeholder="seu@email.com"
          type={TypeText.Email}
          setText={setEmail}
        ></InputText>

        <InputText
          label="Senha"
          text={senha}
          placeholder="••••••••"
          type={TypeText.Password}
          setText={setSenha}
        ></InputText>

        <FncButton title="Entrar" type={TypeButton.Submit} />
      </form>

      {erroMsg !== null && <ErrorText text={erroMsg} />}

      <SubtitleInteractive
        subtitle="Não tem conta?"
        textInteractive="Criar conta grátis"
        color="#155dfc"
        onClick={() => setExibeCadastro(!exibeCadastro)}
      />

      <MsgTextBox
        title="💡 Credenciais de teste:"
        description="Email: joao@exemplo.com | Senha: Arr0zD12@"
      />
    </div>
  );
};

export default LoginComponent;
