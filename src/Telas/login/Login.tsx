import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RegistrarUsuarioComponente from "../CadastroUsuario/RegistrarUsuarioComponente";
import LoginComponent from "./Componentes/LoginComponent";

export const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegação

  const [exibeCadastro, setExibeCadastro] = useState(Boolean || false);
  return (
    <>
      <div className="container">
        <div className="left">
          <div className="info">
            <h2>Controle total das suas finanças</h2>
            <p>
              Gerencie suas contas, acompanhe investimentos e alcance seus
              objetivos financeiros com nossa plataforma inteligente.
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
          {!exibeCadastro ? (
            <LoginComponent
              exibeCadastro={exibeCadastro}
              setExibeCadastro={setExibeCadastro}
            />
          ) : (
            <RegistrarUsuarioComponente
              exibeCadastro={exibeCadastro}
              setExibeCadastro={setExibeCadastro}
            />
          )}
        </div>
      </div>
    </>
  );
};
