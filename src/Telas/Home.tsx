import React, { useState, useEffect } from "react";
import { GeraRefreshToken } from "../services/auth/tokenService";
import api from "../services/api/apiConnect";
import type { ContaResponse } from "../models/ContasUsuarios/GetContasUsuarios";
import { Global } from "../models/Autenticação/global";
import { useNavigate } from "react-router-dom";
import type { UsuarioResponse } from "../models/Usuario/UsuarioResponse";
import "./HomeStyle.css";
import Modal from "../componentes/Modal/Modal";
import CadContas from "../componentes/Contas/CadContas";
import ContaComponent from "../componentes/Contas/ContaComponent";
import PatrimonioTotal from "../componentes/Contas/PatrimonioTotal";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [contasObtidas, setcontasObtidas] = useState<ContaResponse | null>(
    null,
  );
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);

  const [telaAtual, setTelaAtual] = useState(0);
  const [isCadContaOpen, setIsCadContaOpen] = useState(false);
  const buscaContas = async () => {
    let resposta = await api<ContaResponse>(
      "/ContasUsuarios",
      "GET",
      undefined,
      true,
    );

    console.log(resposta);

    if (resposta.sucesso && resposta.dados) {
      setcontasObtidas(resposta.dados);
    }
  };

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

  useEffect(() => {
    const init = async () => {
      // 🔥 SEM verificar antes
      const refresh = await GeraRefreshToken();

      if (refresh.sucesso && refresh.dados) {
        await buscarUsuario();
        await buscaContas();
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate("/", { replace: true });
      }
    };

    init();
  }, []);

  if (isLoggedIn === null) {
    return <p>Verificando status de login...</p>;
  }

  const retornaBoasVindas = () => {
    const hora = new Date().getHours();
    if (hora >= 0 && hora <= 3)
      return "Vá dormir! Você é corno 🐂 , não morcego... 🦇🦇";
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const retornaTelas = () => {
    if (telaAtual === 0)
      return (
        <>
          <div className="menu-superior">
            <div className="texto-superior">
              <p>{retornaBoasVindas()},</p>
              <h1>Minhas Contas</h1>
            </div>
            <button
              className="botão-transação"
              onClick={() => setIsCadContaOpen(true)}
            >
              + Nova Conta Bancaria
            </button>
          </div>

          <div className="principal">
            {contasObtidas?.conteudo !== undefined && (
              <PatrimonioTotal contaBancaria={contasObtidas?.conteudo} />
            )}
            <div className="grid-cards">
              {contasObtidas?.conteudo.map((conta) => (
                <ContaComponent key={conta.idConta} contaBancaria={conta} />
              ))}
            </div>

            <Modal
              isOpen={isCadContaOpen}
              onClose={() => setIsCadContaOpen(false)}
            >
              <CadContas />
            </Modal>
          </div>
        </>
      );
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
            className={telaAtual === 0 ? "nav__item active" : "nav__item"}
            onClick={() => setTelaAtual(0)}
          >
            <span className="material-icons">account_balance</span>
            Contas
          </div>
          <div
            className={telaAtual === 1 ? "nav__item active" : "nav__item"}
            onClick={() => setTelaAtual(1)}
          >
            <span className="material-icons">dashboard</span>
            Dashboard
          </div>
          <div className="nav__item">
            <span className="material-icons">wallet</span>
            Transações
          </div>
          <div className="nav__item">
            <span className="material-icons">add_task</span>
            Metas
          </div>
          <div className="nav__item">
            <span className="material-icons">bar_chart</span>
            Relatórios
          </div>
          <div className="nav__item">
            <span className="material-icons">settings</span>
            Configurações
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
