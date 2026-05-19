import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api/apiConnect";
import type { ContaResponse } from "../../models/ContasUsuarios/GetContasUsuarios";
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

export const Home: React.FC = () => {
  const { user, logout, setUser, inicializando } = useContext(AuthContext);

  const { conta, removeConta } = useContext(ContaContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [telaAtual, setTelaAtual] = useState(0);
  const [abrirMsgBox, setAbrirMsgBox] = useState(false);
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
    if (telaAtual === 0 && user !== null) {
      return <Contas setTelaAtual={setTelaAtual} />;
    }
    if (telaAtual === 1) {
      return <Movimentacoes />;
    }
    if (telaAtual === 3) {
      return <Convites />;
    }
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

          <div className="fnc-home-iten-primary">
            {
              //<MenuItem title="Dashboard" icon="dashboard" />
            }

            <MenuItem
              title="Contas"
              icon="account_balance"
              onClick={() => setTelaAtual(0)}
              disabled={telaAtual === 0}
            />

            {conta && (
              <MenuItem
                title={conta.titulo}
                icon="wallet"
                onClick={() => setTelaAtual(1)}
                disabled={telaAtual === 1}
              />
            )}
            <MenuItem
              title="Convites"
              icon="person_add"
              onClick={() => setTelaAtual(3)}
              disabled={telaAtual === 3}
            />
          </div>
          <div className="fnc-home-iten-secundary">
            {conta && telaAtual === 1 && (
              <MenuItem
                title="Sair da Conta"
                icon="exit_to_app"
                onClick={() => setAbrirMsgBox(true)}
                background="#ff4b4b"
              />
            )}
          </div>
        </nav>

        {abrirMsgBox && (
          <MsgBox
            title="Sair da Conta"
            description="Deseja realmente sair da conta?"
            type={TypeMsgBox.Question}
            onQuestion={(confirmou: boolean) => {
              if (confirmou) {
                sairDaContaBancaria();
              }

              setAbrirMsgBox(false);
            }}
          />
        )}

        <div className="sidebar__footer">
          <button className="logout__button" onClick={() => deslogar()}>
            <span className="material-icons">exit_to_app</span>
            Deslogar
          </button>
        </div>
      </aside>

      <main className="pagina-central">{retornaTelas()}</main>
    </div>
  );
};
