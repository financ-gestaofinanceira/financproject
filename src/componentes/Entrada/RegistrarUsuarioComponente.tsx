import React, { useState } from "react";
import api from "../../services/api/apiConnect";

interface RegisterProps {
  exibeCadastro: Boolean;
  setExibeCadastro: React.Dispatch<React.SetStateAction<boolean>>;
}

type registesUser = {
  primeiroNome: string;
  segundoNome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};
const RegistrarUsuarioComponente: React.FC<RegisterProps> = ({
  setExibeCadastro,
}) => {
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);
  const [primeiroNome, setPrimeiroNome] = useState<string>("");
  const [segundoNome, setSegundoNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmaSenha, setConfirmaSenha] = useState<string>("");

  const cadastraUsuario = async () => {
    const request: registesUser = {
      primeiroNome: primeiroNome,
      segundoNome: segundoNome,
      email: email,
      senha: senha,
      confirmarSenha: confirmaSenha,
    };
    console.log(request);
    var retorno = await api<string>("Usuarios/registrar", "POST", request);
    if (!retorno.sucesso) setErroMsg(retorno.erro);
    else {
      setErroMsg(undefined);
      setExibeCadastro(false);
    }
    console.log(retorno);
  };

  return (
    <div className="login-box">
      <h1>Vamos começar!</h1>
      <p className="subtitle">O primeiro passo para sua educação financeira!</p>

      <form className="form" onSubmit={cadastraUsuario}>
        <div className="row">
          <div className="input-group">
            <label>Primeiro Nome</label>
            <input
              type="text"
              placeholder="Primeiro nome"
              value={primeiroNome}
              onChange={(e) => setPrimeiroNome(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Sobrenome</label>
            <input
              type="text"
              placeholder="Sobrenome"
              value={segundoNome}
              onChange={(e) => setSegundoNome(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="input-group">
            <label>Senha</label>
            <input
              type="text"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Confirmar Senha</label>
            <input
              type="text"
              placeholder="••••••••"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn">
          Criar conta
        </button>
      </form>

      <p className="error">{erroMsg}</p>

      <p className="register">
        Já tem conta?
        <span onClick={() => setExibeCadastro(false)}>Fazer login</span>
      </p>
    </div>
  );
};

export default RegistrarUsuarioComponente;
