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
  const [erroMsg, setErroMsg] = useState<string>();
  const [contaFavorita, setContaFavorita] = useState<boolean>(
    conta!.contaFavorita,
  );

  const atualizaContabilizaSaldo = conta!.somaSaldo;
  function getTextColor(bgColor: string) {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);

    // fórmula de luminância simplificada
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 186 ? "#000000" : "#FFFFFF";
  }

  const favoritarConta = async () => {
    try {
      await api<string>(`/ContasUsuarios/${conta?.idConta}/Favorita`, "POST");
      setContaFavorita(!contaFavorita);
    } catch {}
  };
  const editarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const request = {
        titulo: titulo,
        cor: cor,
      };

      const resposta = await api<ApiResult<ContaResponse>>(
        `/Contas/${conta!.idConta}/atualiza`,
        "PATCH",
        request,
      );

      if (resposta.sucesso) {
      } else {
        setErroMsg(resposta!.erro);
        return;
      }

      if (atualizaContabilizaSaldo !== contabilizaSaldo) {
        const resposta = await api<ApiResult<ContaResponse>>(
          `/ContasUsuarios/${conta!.idConta}/AutoSoma`,
          "POST",
          request,
        );

        if (resposta.sucesso) {
        } else {
          setErroMsg(resposta!.erro);
          return;
        }
      }
      setRetorno(0);
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    }
  };
  return (
    <>
      <div>
        <TitleText text={`Editar - ${conta!.titulo}`} />
      </div>
      <div className="fnc-ctn-edit-conta">
        <div className="fnc-sub-edit-conta">
          {usuario!.permissao === 0 && (
            <>
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
                label="Titulo conta"
                placeholder="Ex: Minha Conta"
              />
            </>
          )}
          <InputCheckBox
            checked={contabilizaSaldo}
            label="Somar saldo na tela inicial"
            setChecked={setContabilizaSaldo}
          />
          <div>
            <FncButton
              icon="star"
              colorIcon={contaFavorita ? "#e2c20c" : null}
              title={contaFavorita ? "Conta Favorita" : "Favoritar Conta"}
              onClick={() => favoritarConta()}
            />
            {erroMsg && <ErrorText text={erroMsg} />}
          </div>
        </div>
        <div className="fnc-ctn-btn-edit-conta">
          <div>
            <FncButton title="Editar Conta" onClick={editarConta} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditaConta;
