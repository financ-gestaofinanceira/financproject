import React, { useState, useEffect } from "react";
import { GeraRefreshToken } from "../services/auth/tokenService";
import api from "../services/api/apiConnect";
import type { ContaResponse } from "../models/ContasUsuarios/GetContasUsuarios";
import { Global } from "../models/Autenticação/global";
import { useNavigate } from "react-router-dom";
import type { UsuarioResponse } from "../models/Usuario/UsuarioResponse";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [contasObtidas, setcontasObtidas] = useState<ContaResponse | null>(
    null,
  );
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);

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

  return (
    <div>
      <button onClick={() => deslogar()}>Sair</button>
      <button onClick={() => buscarUsuario()}>Teste</button>
      {isLoggedIn ? (
        <>
          <h1>Bem-vindo {usuario?.nomeCompleto}</h1>
          <p>Você fez login com sucesso.</p>
          {contasObtidas?.conteudo.map((conta) => (
            <div key={conta.idConta}>
              <p>
                <strong>ID:</strong> {conta.idConta}
              </p>
              <p>
                <strong>Título:</strong> {conta.titulo}
              </p>
              <p>
                <strong>Status:</strong> {conta.status}
              </p>
              <hr />
            </div>
          ))}{" "}
          {/* Conteúdo adicional para usuários logados */}
        </>
      ) : (
        <p className="error">
          Você não está logado. Por favor, faça login para acessar esta página.
        </p>
      )}
    </div>
  );
};
