import React, { useState, useEffect } from 'react';
import { GeraRefreshToken } from '../services/auth/tokenService';
import api from "../services/api/apiConnect";
import type { ContaResponse } from '../models/ContasUsuarios/GetContasUsuarios';


export const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [contasObtidas, setcontasObtidas] = useState<ContaResponse | null>(null);

  const buscaContas = async () => {
    let resposta = await api<ContaResponse>(
      "/ContasUsuarios",
      "GET",
      undefined,
      true
    );

    console.log(resposta);

    if (resposta.sucesso && resposta.dados) {
      setcontasObtidas(resposta.dados);
    }
  };

 useEffect(() => {
  const init = async () => {
    // 🔥 SEM verificar antes
    const refresh = await GeraRefreshToken();

    if (refresh.sucesso && refresh.dados) {
      await buscaContas();
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  init();
}, []);

  if (isLoggedIn === null) {
    return <p>Verificando status de login...</p>;
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Bem-vindo ao Dashboard!</h1>
          <p>Você fez login com sucesso.</p>
{contasObtidas?.conteudo.map((conta) => (
  <div key={conta.idConta}>
    <p><strong>ID:</strong> {conta.idConta}</p>
    <p><strong>Título:</strong> {conta.titulo}</p>
    <p><strong>Status:</strong> {conta.status}</p>
    <hr />
  </div>
))}          {/* Conteúdo adicional para usuários logados */}
        </>
      ) : (
        <p className="error">Você não está logado. Por favor, faça login para acessar esta página.</p>
      )}
    </div>
  );
};