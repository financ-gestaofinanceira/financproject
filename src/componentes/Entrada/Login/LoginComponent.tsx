import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GeraRefreshToken,
  GeraToken,
} from "../../../services/auth/tokenService";
import type { tokeRequest } from "../../../models/Autenticação/tokenRequest";
import "../../../App.css";
import InputText from "../../../refatoracao/props/InputText/InputText";
import { TypeText } from "../../../refatoracao/props/InputText/TypeText";
import TitleText from "../../../refatoracao/props/TitleText/TitleText";
import SubtitleText from "../../../refatoracao/props/SubtitleText/SubtitleText";
import ErrorText from "../../../refatoracao/props/ErrorText/ErrorText";
import SubtitleInteractive from "../../../refatoracao/props/SubtitleInteractive/SubtitleInteractive";
import MsgBox from "../../../refatoracao/props/TextBox/MsgtBox";
import FncButton from "../../../refatoracao/props/FncButton/FncButton";
import { TypeButton } from "../../../refatoracao/props/FncButton/TypeButton";

import "./LoginComponentStyle.css";
import { AuthContext, type TokenData } from "../../../contexts/AuthContext";

interface LoginProps {
  exibeCadastro: Boolean;
  setExibeCadastro: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginComponent: React.FC<LoginProps> = ({
  exibeCadastro,
  setExibeCadastro,
}) => {
  const { login, tokenData, authenticated } = useContext(AuthContext);

  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  useEffect(() => {
    console.log(authenticated);

    if (authenticated) {
      navigate("/home");
    }
  }, [tokenData]);

  const navigate = useNavigate(); // Hook para navegação

  const reqApi = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
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

      if (!resposta.dados?.token && !resposta.dados?.expiracao) return;

      const tokenObj: TokenData = {
        token: resposta.dados.token,
        expiration: resposta.dados.expiracao,
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
      <TitleText text="Bem-vindo" />
      <SubtitleText text="Entre na sua conta para continuar" />

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

      <MsgBox
        title="💡 Credenciais de teste:"
        description="Email: joao@exemplo.com | Senha: Arr0zD12@"
      />
    </div>
  );
};

export default LoginComponent;
