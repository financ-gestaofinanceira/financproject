import React, { useState, useEffect, useContext } from "react";
import { GeraRefreshToken } from "../../services/auth/tokenService";
import api from "../../services/api/apiConnect";
import type {
  ContaResponse,
  GetContasUsuarios,
} from "../../models/ContasUsuarios/GetContasUsuarios";
import { useNavigate } from "react-router-dom";
import type { UsuarioResponse3 } from "../../models/Usuario/UsuarioResponse";
import "./HomeStyle.css";
import Contas from "../contas/Contas";
import Movimentacoes from "../movimentacoes/Movimentacoes";
import { AuthContext } from "../../contexts/AuthContext";
import Carregamento from "../../componentes/Carregamento/Carregamento";

export const Home: React.FC = () => {
  const { tokenData, authenticated, user, logout, setUser } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [telaAtual, setTelaAtual] = useState(0);

  const [contaSelecionada, setContaSelecionada] = useState<
    GetContasUsuarios | undefined
  >();

  const buscarUsuario = async () => {
    const resposta = await api<UsuarioResponse3>(
      "/Usuarios/me",
      "GET",
      undefined,
      tokenData?.token,
    );

    if (resposta.sucesso && resposta.dados) {
      setUser(resposta.dados);
      return;
    }

    console.log("passou");
    if (resposta.status === 401) {
      const refresh = await GeraRefreshToken();
      if (refresh.sucesso) {
        return;
      }
    }
    logout();
    navigate("/", { replace: true });
  };

  const deslogar = async () => {
    await api<ContaResponse>(
      "/Autenticacao/revoke",
      "POST",
      undefined,
      tokenData!.token,
    );
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const init = async () => {
      if (!authenticated) {
        navigate("/", { replace: true });
        return;
      }

      if (!tokenData?.token) return;

      setLoading(true);

      if (!user) {
        await buscarUsuario();
      }

      setLoading(false);
    };

    init();
  }, [authenticated, tokenData?.token]);

  if (loading) {
    return <Carregamento />;
  }

  const retornaTelas = () => {
    if (telaAtual === 0 && user !== null) {
      return (
        <Contas
          setTelaAtual={setTelaAtual}
          usuario={user}
          usaRefresh={() => console.log()}
          contaBancaria={setContaSelecionada}
        />
      );
    }
    if (
      telaAtual === 1 &&
      contaSelecionada !== null &&
      contaSelecionada !== undefined &&
      user !== null
    ) {
      return (
        <Movimentacoes
          contaBancaria={contaSelecionada}
          setContaBancaria={setContaSelecionada}
          usuario={user}
        />
      );
    }
  };

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__logo-icon">
            <span className="material-icons" style={{ color: "white" }}>
              account_balance_wallet
            </span>
          </div>
          <div className="sidebar__logo-text">
            <h1 className="sidebar__title">FinanceHub</h1>
            <p className="sidebar__subtitle">Gestão Inteligente</p>
          </div>
        </div>

        <div className="sidebar__user">
          <div className="user__avatar">
            {user?.nomeCompleto?.charAt(0) || "U"}
          </div>
          <div className="user__info">
            <p className="user__name">{user?.nomeCompleto || "Usuário"}</p>
            <p className="user__email">{user?.email || "email@exemplo.com"}</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          <p className="nav__title">Menu</p>
          <div
            className={telaAtual === 2 ? "nav__item active" : "nav__item"}
            onClick={() => setTelaAtual(2)}
          >
            <span className="material-icons">dashboard</span>
            Dashboard
          </div>
          <div
            className={telaAtual === 0 ? "nav__item active" : "nav__item"}
            onClick={() => setTelaAtual(0)}
          >
            <span className="material-icons">account_balance</span>
            Contas
          </div>
          <div className={telaAtual === 1 ? "nav__item active" : "nav__item"}>
            <span className="material-icons">wallet</span>
            Transações
          </div>
        </nav>

        <div className="sidebar__footer">
          <button className="logout__button" onClick={() => deslogar()}>
            <span className="material-icons">exit_to_app</span>
            Sair da conta
          </button>
        </div>
      </aside>

      <main className="pagina-central">{retornaTelas()}</main>
    </div>
  );
};
