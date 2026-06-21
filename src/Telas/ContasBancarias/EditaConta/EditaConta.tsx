import FncButton from "../../../props/FncButton/FncButton";
import ErrorText from "../../../props/ErrorText/ErrorText";
import TitleText from "../../../props/TitleText/TitleText";
import InputTextAndColor from "../../../props/InputTextAndColor/InputTextAndColor";
import { useContext, useState } from "react";
import { ContaContext } from "../../../contexts/ContaContext";
import "./EditaContaStyle.css";
import InputCheckBox from "../../../props/InputCheckBox/InputCheckBox";
import api from "../../../services/api/apiConnect";
import { ApiResult } from "../../../models/interface/ApiResult";
import { ContaResponse } from "../../../models/ContasUsuarios/GetContasBancarias";

type Props = { setRetorno: (valor: number) => void };

const EditaConta: React.FC<Props> = ({ setRetorno }) => {
  const { conta, usuario } = useContext(ContaContext);

  const [titulo, setTitulo] = useState<string>(conta!.titulo);
  const [cor, setCor] = useState<string>(conta!.cor);
  const [contabilizaSaldo, setContabilizaSaldo] = useState<boolean>(
    conta!.somaSaldo,
  );
  const [contaFavorita, setContaFavorita] = useState<boolean>(
    conta!.contaFavorita,
  );
  const [erroMsg, setErroMsg] = useState<string>();

  function getTextColor(bgColor: string) {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? "#000000" : "#FFFFFF";
  }

  const favoritarConta = async () => {
    try {
      await api<string>(`/ContasUsuarios/${conta?.idConta}/Favorita`, "POST");
      setContaFavorita(!contaFavorita);
    } catch {}
  };

  const alternarContabilizaSaldo = async () => {
    const novoValor = !contabilizaSaldo;
    setErroMsg(undefined);
    try {
      const resposta = await api<ApiResult<ContaResponse>>(
        `/ContasUsuarios/${conta!.idConta}/AutoSoma`,
        "POST",
      );
      if (resposta.sucesso) {
        setContabilizaSaldo(novoValor);
      } else {
        setErroMsg(resposta!.erro);
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    }
  };

  const editarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(undefined);
    try {
      const resposta = await api<ApiResult<ContaResponse>>(
        `/Contas/${conta!.idConta}/atualiza`,
        "PATCH",
        { titulo, cor },
      );
      if (resposta.sucesso) {
        setRetorno(0);
      } else {
        setErroMsg(resposta!.erro);
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    }
  };

  return (
    <>
      <TitleText text={`Editar — ${conta!.titulo}`} />

      <div className="fnc-ctn-edit-conta">
        <div className="fnc-sub-edit-conta">

          {/* Controles disponíveis para qualquer permissão */}
          <span className="fnc-section-label">Preferências</span>

          <div className="fnc-toggle-row" onClick={alternarContabilizaSaldo}>
            <InputCheckBox
              checked={contabilizaSaldo}
              label="Somar saldo na tela inicial"
              setChecked={alternarContabilizaSaldo}
            />
          </div>

          <div className="fnc-favoritar-row">
            <FncButton
              icon="star"
              colorIcon={contaFavorita ? "#e2c20c" : null}
              title={contaFavorita ? "Conta favorita" : "Favoritar conta"}
              onClick={favoritarConta}
            />
          </div>

          {/* Edição de título e cor — somente admin */}
          {usuario!.permissao === 0 && (
            <>
              <div className="fnc-edit-divider" />
              <span className="fnc-section-label">Aparência</span>

              {titulo && (
                <div className="fnc-name-conta" style={{ background: cor }}>
                  <p style={{ color: getTextColor(cor) }}>{titulo}</p>
                </div>
              )}

              <InputTextAndColor
                maxLenght={100}
                color={cor}
                onChangeColor={setCor}
                text={titulo}
                setText={setTitulo}
                label="Nome da conta"
                placeholder="Ex: Minha Conta"
              />
            </>
          )}

          {erroMsg && <ErrorText text={erroMsg} />}
        </div>

        {usuario!.permissao === 0 && (
          <div className="fnc-ctn-btn-edit-conta">
            <FncButton title="Salvar alterações" onClick={editarConta} />
          </div>
        )}
      </div>
    </>
  );
};

export default EditaConta;