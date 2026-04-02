import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import type { tokeRequest } from "./models/Autenticação/tokenRequest";
import { GeraRefreshToken, GeraToken } from './services/auth/tokenService';
import {Home} from './Telas/Home'; // Importa o componente Dashboard

interface TokenData {
  token: string;
  refreshToken: string;
}

function AppContent() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    if (tokenData) {
      navigate('/home'); // Navega para o dashboard se houver tokenData
    }
  }, [tokenData, navigate]);

  // Função para login
  const reqApi = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    try {
      const request: tokeRequest = {
        email: email,
        senha: senha
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
        refreshToken: resposta.dados!.refreshToken
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
    <>
      <div className="container">
        <div className="left">
          <div className="info">
            <h2>Controle total das suas finanças</h2>
            <p>
              Gerencie suas contas, acompanhe investimentos e alcance seus objetivos financeiros com nossa plataforma inteligente.
            </p>

            <div className="stats">
              <div>
                <span className="number">50K+</span>
                <span>Usuários</span>
              </div>
              <div>
                <span className="number">R$2B+</span>
                <span>Gerenciados</span>
              </div>
              <div>
                <span className="number">4.9*</span>
                <span>Avaliação</span>
              </div>
            </div>
          </div>
          <div className="brand">Financ</div>
        </div>

        <div className="right">
          <div className="login-box">
            <img src="" alt="" />
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

              <button type="submit" className="btn">Entrar</button>
            </form>
          
            <p className="error">
              {erroMsg}
            </p>

            <p className="register">
              Não tem conta? <span>Criar conta grátis</span>
            </p>

            <div className="test-box">
              <strong>💡 Credenciais de teste:</strong>
              <p>Email: joao@exemplo.com | Senha: Arr0zD12@</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;