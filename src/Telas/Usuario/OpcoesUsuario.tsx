import React, { useState, useContext } from "react";
import api from "../../services/api/apiConnect";
import { AuthContext } from "../../contexts/AuthContext";
import { ContaContext } from "../../contexts/ContaContext";
import { useNavigate } from "react-router-dom";
import InputText from "../../props/InputText/InputText";
import { TypeText } from "../../props/InputText/TypeText";
import ErrorText from "../../props/ErrorText/ErrorText";
import FncButton from "../../props/FncButton/FncButton";
import { TypeThemeButton } from "../../props/FncButton/TypeThemeButton";
import InputCheckBox from "../../props/InputCheckBox/InputCheckBox";
import "./OpcoesUsuarioStyle.css";

const OpcoesUsuario: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const { removeConta } = useContext(ContaContext);
  const navigate = useNavigate();

  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erroSenhaAntiga, setErroSenhaAntiga] = useState<string | null>(null);
  const [erroSenhaNova, setErroSenhaNova] = useState<string | null>(null);
  const [erroConfirmar, setErroConfirmar] = useState<string | null>(null);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const validar = (): boolean => {
    let valido = true;
    setErroSenhaAntiga(null);
    setErroSenhaNova(null);
    setErroConfirmar(null);
    setErroGeral(null);

    if (!senhaAntiga.trim()) {
      setErroSenhaAntiga("Informe a senha atual.");
      valido = false;
    }

    if (!senhaNova.trim()) {
      setErroSenhaNova("Informe a nova senha.");
      valido = false;
    } else if (senhaNova.length < 6) {
      setErroSenhaNova("A nova senha deve ter pelo menos 6 caracteres.");
      valido = false;
    }

    if (!confirmarSenha.trim()) {
      setErroConfirmar("Confirme a nova senha.");
      valido = false;
    } else if (confirmarSenha !== senhaNova) {
      setErroConfirmar("As senhas não coincidem.");
      valido = false;
    }

    return valido;
  };

  const handleAlterarSenha = async () => {
    if (!validar()) return;

    setLoading(true);
    const resposta = await api<null>("/Usuarios/alterar_senha", "POST", {
      senhaAntiga,
      senhaNova,
    });
    setLoading(false);

    if (!resposta.sucesso) {
      setErroGeral(resposta.erro ?? "Erro ao alterar senha.");
      return;
    }

    setSucesso(true);
    await api<null>("/Autenticacao/revoke", "POST", undefined);
    logout();
    removeConta();
    navigate("/", { replace: true });
  };

  const tipoSenha = mostrarSenha ? TypeText.Text : TypeText.Password;

  return (
    <div className="fnc-opcoes-usuario">
      <div className="fnc-opcoes-usuario__header">
        <div className="fnc-opcoes-usuario__icon">
          <span className="material-icons">lock</span>
        </div>
        <p className="fnc-opcoes-usuario__title">Alterar Senha</p>
        <p className="fnc-opcoes-usuario__subtitle">
          Após a alteração você será deslogado automaticamente.
        </p>
      </div>

      <div className="fnc-opcoes-usuario__card">
        <p className="fnc-opcoes-usuario__section-title">Senha atual</p>

        <InputText
          label="Senha atual"
          text={senhaAntiga}
          setText={setSenhaAntiga}
          type={tipoSenha}
          placeholder="Digite sua senha atual"
        />
        {erroSenhaAntiga && <ErrorText text={erroSenhaAntiga} />}

        <hr className="fnc-opcoes-usuario__divider" />
        <p className="fnc-opcoes-usuario__section-title">Nova senha</p>

        <InputText
          label="Nova senha"
          text={senhaNova}
          setText={setSenhaNova}
          type={tipoSenha}
          placeholder="Digite a nova senha"
        />
        {erroSenhaNova && <ErrorText text={erroSenhaNova} />}

        <InputText
          label="Confirmar nova senha"
          text={confirmarSenha}
          setText={setConfirmarSenha}
          type={tipoSenha}
          placeholder="Confirme a nova senha"
        />
        {erroConfirmar && <ErrorText text={erroConfirmar} />}

        <div className="fnc-opcoes-usuario__mostrar-senha">
          <InputCheckBox
            label="Mostrar senhas"
            checked={mostrarSenha}
            setChecked={setMostrarSenha}
          />
        </div>

        {erroGeral && <ErrorText text={erroGeral} />}

        {sucesso && (
          <div className="fnc-opcoes-usuario__sucesso">
            <span className="material-icons">check_circle</span>
            <span>Senha alterada! Redirecionando...</span>
          </div>
        )}

        <FncButton
          title={loading ? "Salvando..." : "Alterar Senha"}
          thema={TypeThemeButton.Default}
          disabled={loading}
          onClick={handleAlterarSenha}
        />
      </div>
    </div>
  );
};

export default OpcoesUsuario;
