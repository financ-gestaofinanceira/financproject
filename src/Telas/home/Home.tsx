import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api/apiConnect";
import type { ContaResponse } from "../../models/ContasUsuarios/GetContasBancarias";
import { useNavigate } from "react-router-dom";
import type { UsuarioResponse3 } from "../../models/Usuario/UsuarioResponse";
import "./HomeStyle.css";
import Contas from "../ContasBancarias/Contas";
import { AuthContext } from "../../contexts/AuthContext";
import Carregamento from "../../componentes/Carregamento/Carregamento";
import MenuItem from "../../props/MenuItem/MenuItem";
import { ContaContext } from "../../contexts/ContaContext";
import Movimentacoes from "../Movimentacoes/Movimentacoes";
import Convites from "../Convites/Convites";
import MsgBox from "../../props/MsgBox/MsgBox";
import { TypeMsgBox } from "../../props/MsgBox/TypeMsgBox";
import Membros from "../Membros/Membros";
import EditaConta from "../ContasBancarias/EditaConta/EditaConta";
import MovimentacaoFixa from "../Movimentacoes/Fixas/MovimentacaoFixa";
import LabelText from "../../props/LabelText/LabelText";

export const Home: React.FC = () => {
  const { user, logout, setUser, inicializando } = useContext(AuthContext);
  const { conta, removeConta } = useContext(ContaContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recolhida, setRecolhida] = useState(false);
  const [mobileAberto, setMobileAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [telaAtual, setTelaAtual] = useState(0);
  const [abrirMsgBoxExit, setAbrirMsgBoxExit] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);

  const buscarUsuario = async () => {
    const resposta = await api<UsuarioResponse3>(
      "/Usuarios/me",
      "GET",
      undefined,
    );
    if (resposta.sucesso && resposta.dados) {
      setUser(resposta.dados);
    }
  };

  const deslogar = async () => {
    await api<ContaResponse>("/Autenticacao/revoke", "POST", undefined);
    logout();
    removeConta();
    navigate("/", { replace: true });
  };

  const sairDaContaBancaria = async () => {
    const response = await api<string>(
      `/ContasUsuarios/${conta?.idConta}/sair`,
      "POST",
    );
    if (response!.sucesso) {
      removeConta();
      setTelaAtual(0);
    } else {
      setErroMsg(response!.erro!);
    }
  };

  useEffect(() => {
    if (inicializando) return;
    const init = async () => {
      if (!user) {
        await buscarUsuario();
      }
      setLoading(false);
    };
    init();
  }, [inicializando]);

  if (loading) {
    return <Carregamento />;
  }

  const retornaTelas = () => {
    if (telaAtual === 0 && user !== null)
      return <Contas setTelaAtual={setTelaAtual} />;
    if (telaAtual === 1) return <Movimentacoes />;
    if (telaAtual === 3) return <Convites />;
    if (telaAtual === 4) return <Membros />;
    if (telaAtual === 5) return <EditaConta setRetorno={setTelaAtual} />;
    if (telaAtual === 6) return <MovimentacaoFixa />;
  };

  return (
    <div className="home-container">
      {erroMsg && (
        <MsgBox
          title="Ocorreu um problema!"
          description={erroMsg}
          type={TypeMsgBox.Ok}
          centerlize={true}
        />
      )}

      {/* Header Mobile */}
      <header className="mobile-header">
        <div className="mobile-header__logo">
          <span className="material-icons">account_balance_wallet</span>
          <span onClick={() => setTelaAtual(0)}>FinancHub</span>
        </div>
        <button
          className="mobile-header__menu-btn"
          onClick={() => setMobileAberto(!mobileAberto)}
        >
          <span className="material-icons">
            {mobileAberto ? "close" : "menu"}
          </span>
        </button>
      </header>

      {/* Overlay para fechar o menu mobile ao clicar fora */}
      {mobileAberto && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileAberto(false)}
        />
      )}

      <aside
        className={`sidebar ${recolhida ? "sidebar--recolhida" : ""} ${
          mobileAberto ? "sidebar--mobile-aberto" : ""
        }`}
      >
        {/* Botão toggle (apenas desktop) */}
        <button
          className="sidebar__toggle"
          onClick={() => setRecolhida((v) => !v)}
          title={recolhida ? "Expandir menu" : "Recolher menu"}
        >
          <span className="material-icons">
            {recolhida ? "chevron_right" : "chevron_left"}
          </span>
        </button>

        <div className="sidebar__header">
          <div className="sidebar__logo-icon">
            <span className="material-icons" style={{ color: "white" }}>
              account_balance_wallet
            </span>
          </div>
          {(!recolhida || isMobile) && (
            <div className="sidebar__logo-text">
              <h1 className="sidebar__title">FinanceHub</h1>
              <p className="sidebar__subtitle">Gestão Inteligente</p>
            </div>
          )}
        </div>

        <div className="sidebar__user">
          <div className="user__avatar">
            {user?.nomeCompleto?.charAt(0) || "U"}
          </div>
          {(!recolhida || isMobile) && (
            <div className="user__info">
              <p className="user__name">{user?.nomeCompleto || "Usuário"}</p>
              <p className="user__email">
                {user?.email || "email@exemplo.com"}
              </p>
            </div>
          )}
        </div>

        <nav className="sidebar__nav">
          {(!recolhida || isMobile) && <p className="nav__title">Menu</p>}

          <div className="fnc-home-iten-primary">
            <MenuItem
              title={recolhida && !isMobile ? undefined : "Contas"}
              icon="account_balance"
              onClick={() => {
                setTelaAtual(0);
                setMobileAberto(false);
              }}
              disabled={telaAtual === 0}
              tooltip="Contas"
            />

            {conta && (
              <MenuItem
                title={recolhida && !isMobile ? undefined : conta.titulo}
                icon="wallet"
                onClick={() => {
                  setTelaAtual(1);
                  setMobileAberto(false);
                }}
                disabled={telaAtual === 1 || telaAtual === 4}
                tooltip={conta.titulo}
              />
            )}

            <MenuItem
              title={recolhida && !isMobile ? undefined : "Convites"}
              icon="person_add"
              onClick={() => {
                setTelaAtual(3);
                setMobileAberto(false);
              }}
              disabled={telaAtual === 3}
              tooltip="Convites"
            />
          </div>

          <div className="fnc-home-iten-secundary">
            {conta &&
              (telaAtual === 1 ||
                telaAtual === 4 ||
                telaAtual === 5 ||
                telaAtual === 6) && (
                <div className="fnc-home-itens">
                  <MenuItem
                    title={recolhida && !isMobile ? undefined : "Agendadas"}
                    icon="browse_gallery"
                    onClick={() => {
                      setTelaAtual(6);
                      setMobileAberto(false);
                    }}
                    background="#4056f9"
                    disabled={telaAtual === 6}
                    tooltip="Membros da Conta"
                  />

                  <MenuItem
                    title={
                      recolhida && !isMobile ? undefined : "Membros da Conta"
                    }
                    icon="group"
                    onClick={() => {
                      setTelaAtual(4);
                      setMobileAberto(false);
                    }}
                    background="#4056f9"
                    disabled={telaAtual === 4}
                    tooltip="Membros da Conta"
                  />

                  <MenuItem
                    title={recolhida && !isMobile ? undefined : "Configurações"}
                    icon="settings"
                    onClick={() => {
                      setTelaAtual(5);
                      setMobileAberto(false);
                    }}
                    background="#4056f9"
                    disabled={telaAtual === 5}
                    tooltip="Membros da Conta"
                  />

                  <MenuItem
                    title={recolhida && !isMobile ? undefined : "Sair da Conta"}
                    icon="exit_to_app"
                    onClick={() => setAbrirMsgBoxExit(true)}
                    background="#ff4b4b"
                    tooltip="Sair da Conta"
                  />
                </div>
              )}
          </div>
        </nav>

        {abrirMsgBoxExit && (
          <MsgBox
            title="Sair da Conta"
            description="Deseja realmente sair da conta?"
            type={TypeMsgBox.Question}
            onQuestion={(confirmou: boolean) => {
              if (confirmou) sairDaContaBancaria();
              setAbrirMsgBoxExit(false);
            }}
          />
        )}

        <div className="fnc-version">
          <LabelText text="Alpha v1.0.0.0" />
        </div>
        <div className="sidebar__footer" title="Deslogar">
          <button className="logout__button" onClick={() => deslogar()}>
            <span className="material-icons">exit_to_app</span>
            {(!recolhida || isMobile) && "Deslogar"}
          </button>
        </div>
      </aside>

      <main className="pagina-central">{retornaTelas()}</main>
    </div>
  );
};
