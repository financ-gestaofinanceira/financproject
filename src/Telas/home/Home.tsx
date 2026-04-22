import React, { useState, useEffect } from "react";
import { GeraRefreshToken } from "../../services/auth/tokenService";
import api from "../../services/api/apiConnect";
import type {
  ContaResponse,
  GetContasUsuarios,
} from "../../models/ContasUsuarios/GetContasUsuarios";
import { Global } from "../../models/Autenticação/global";
import { useNavigate } from "react-router-dom";
import type { UsuarioResponse } from "../../models/Usuario/UsuarioResponse";
import "./HomeStyle.css";
import Contas from "../contas/Contas";
import Movimentacoes from "../movimentacoes/Movimentacoes";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);

  const [telaAtual, setTelaAtual] = useState(0);

  const [contaSelecionada, setContaSelecionada] = useState<
    GetContasUsuarios | undefined
  >();

  const buscarUsuario = async () => {
    let tentativas = 0;
    let sucesso = false;

    while (tentativas < 2 && !sucesso) {
      tentativas++;
      const resposta = await api<UsuarioResponse>(
        "/Usuarios/me",
        "GET",
        undefined,
        true,
      );

      if (resposta.sucesso && resposta.dados) {
        setUsuario(resposta.dados);
        sucesso = true;
        return;
      }

      // Se der 401, tenta refresh token
      if (resposta.status === 401) {
        const refresh = await GeraRefreshToken();
        if (!refresh.sucesso) break; // não adianta continuar se refresh falhar
      } else {
        break; // outro erro, não retry
      }
    }

    // Se falhou depois das tentativas
    Global.BEARER_TOKEN = null;
    navigate("/", { replace: true });
  };

  const deslogar = async () => {
    let resposta = await api<ContaResponse>(
      "/Autenticacao/revoke",
      "POST",
      undefined,
      true,
    );

    if (resposta.sucesso) Global.BEARER_TOKEN = null;

    navigate("/", { replace: true });
  };

  const usaRefresh = async () => {
    const refresh = await GeraRefreshToken();

    if (refresh.sucesso && refresh.dados) {
      await buscarUsuario();
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/", { replace: true });
    }
  };
  const jaExecutou = React.useRef(false);

  useEffect(() => {
    if (jaExecutou.current) return;

    jaExecutou.current = true;

    const init = async () => {
      await usaRefresh();
    };

    init();
  }, []);

  if (isLoggedIn === null) {
    return <p>Verificando status de login...</p>;
  }

  const retornaTelas = () => {
    if (telaAtual === 0 && usuario !== null) {
      return (
        <Contas
          setTelaAtual={setTelaAtual}
          usuario={usuario}
          usaRefresh={usaRefresh}
          contaBancaria={setContaSelecionada}
        />
      );
    }
    if (
      telaAtual === 1 &&
      contaSelecionada !== null &&
      contaSelecionada !== undefined &&
      usuario !== null
    ) {
      return (
        <Movimentacoes
          contaBancaria={contaSelecionada}
          setContaBancaria={setContaSelecionada}
          usuario={usuario}
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
            {usuario?.nomeCompleto?.charAt(0) || "U"}
          </div>
          <div className="user__info">
            <p className="user__name">{usuario?.nomeCompleto || "Usuário"}</p>
            <p className="user__email">
              {usuario?.email || "email@exemplo.com"}
            </p>
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
