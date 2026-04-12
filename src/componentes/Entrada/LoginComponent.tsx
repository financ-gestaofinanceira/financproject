import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeraRefreshToken, GeraToken } from "../../services/auth/tokenService";
import type { tokeRequest } from "../../models/Autenticação/tokenRequest";
import "../../App.css";

interface TokenData {
  token: string;
  refreshToken: string;
}

interface LoginProps {
  exibeCadastro: Boolean;
  setExibeCadastro: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginComponent: React.FC<LoginProps> = ({
  exibeCadastro,
  setExibeCadastro,
}) => {
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const handleAuth = async () => {
      let fazRefresh = await GeraRefreshToken();

      if (fazRefresh.sucesso) {
        navigate("/home");
      }
    };

    handleAuth();
  }, [tokenData, navigate]);

  const reqApi = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    try {
      const request: tokeRequest = {
        email: email,
        senha: senha,
      };

      const resposta = await GeraToken(request);

      if (resposta.erro) {
        console.log(resposta.erro);
        setTokenData(null);
        setErroMsg(resposta.erro);
        return;
      }

      // salva o token de forma consistente
      setTokenData({
        token: resposta.dados!.token,
        refreshToken: resposta.dados!.refreshToken,
      });
      setErroMsg(null);

      console.log("Login:", resposta.dados);
    } catch (erro: any) {
      console.error(erro.message);
      setTokenData(null);
      setErroMsg(erro.message);
    }
  };

  return (
    <div className="login-box">
      <h1>Bem-vindo de volta</h1>
      <p className="subtitle">Entre na sua conta para continuar</p>
      <form className="form" onSubmit={reqApi}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">
          Entrar
        </button>
      </form>

      <p className="error">{erroMsg}</p>

      <p className="register">
        Não tem conta?
        <span onClick={() => setExibeCadastro(!exibeCadastro)}>
          Criar conta grátis
        </span>
      </p>
      <div className="test-box">
        <strong>💡 Credenciais de teste:</strong>
        <p>Email: joao@exemplo.com | Senha: Arr0zD12@</p>
      </div>
    </div>
  );
};

export default LoginComponent;
