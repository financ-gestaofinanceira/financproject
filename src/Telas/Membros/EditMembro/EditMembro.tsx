import { useContext, useEffect, useState } from "react";
import { ContaContext } from "../../../contexts/ContaContext";
import TitleText from "../../../props/TitleText/TitleText";
import InputSelect from "../../../props/InputSelect/InputSelect";
import InputCheckBox from "../../../props/InputCheckBox/InputCheckBox";
import FncButton from "../../../props/FncButton/FncButton";
import { TypeText } from "../../../props/InputText/TypeText";
import InputText from "../../../props/InputText/InputText";
import api from "../../../services/api/apiConnect";
import ErrorText from "../../../props/ErrorText/ErrorText";
import "./EditMembro.css";
type PropEditMembro = {
  setOpen: (value: boolean) => void;
};

const EditMembro: React.FC<PropEditMembro> = ({ setOpen }) => {
  const { conta, membro } = useContext(ContaContext);

  const [acesso, setAcesso] = useState<number>(0);
  const [status, setStatus] = useState<number>(0);

  const [expirarAcesso, setExpirarAcesso] = useState<boolean>(false);

  const [checkExpiracao, setCheckExpiracao] = useState<boolean>(false);
  const [tempoExpiracao, setTempoExpiracao] = useState<string>("15");

  const [expulsar, setExpulsar] = useState<boolean>(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);

  useEffect(() => {
    if (membro) {
      console.log(membro);
      setAcesso(membro.permissao);
      setStatus(membro.status);
    }
  }, [membro]);

  const alteraUsuario = async () => {
    try {
      if (expulsar) {
        const resposta = await api<{
          idConta: number;
          acesso: number;
          idUsuario: string;
        }>(`/ContasUsuarios/${conta?.idConta}/expurgo`, "POST", {
          idUsuarioDestinatario: membro!.idUsuario,
        });
        if (resposta.sucesso && resposta.dados) {
          setOpen(false);
          return;
        }
      }

      let request = {
        idUsuarioAlterado: membro!.idUsuario,
        acesso: acesso,
        status: status,
        expiracao: checkExpiracao === true ? parseInt(tempoExpiracao) : null,
        removerExpiracao: membro?.expiracao
          ? expirarAcesso
            ? true
            : false
          : false,
      };

      console.log(request);

      const resposta = await api<{
        idConta: number;
        acesso: number;
        idUsuario: string;
      }>(`/ContasUsuarios/${conta?.idConta}/alterar`, "PATCH", request);

      if (resposta.sucesso && resposta.dados) {
        setOpen(false);
      } else {
        setErroMsg(resposta!.erro!);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  return (
    <>
      <div className="fnc-edit-user">
        <TitleText text="Alterar Usuario"></TitleText>

        <InputSelect
          label="Permissão"
          opcoes={[
            { label: "Administrador", value: "1" },
            { label: "Visualizador", value: "2" },
            { label: "Mestre", value: "0" },
          ]}
          value={String(acesso)} // ← aqui
          onChange={(valor) => setAcesso(parseInt(valor))}
        />

        <InputCheckBox
          label="Expulsar usuário"
          checked={expulsar}
          setChecked={setExpulsar}
        />

        <InputSelect
          label="Status"
          opcoes={[
            { label: "Ativo", value: "0" },
            { label: "Inativo", value: "1" },
          ]}
          onChange={(valor) => setStatus(parseInt(valor))}
          value={String(status)}
        />

        {membro?.expiracao && (
          <InputCheckBox
            checked={expirarAcesso}
            label="Remover expiração"
            setChecked={setExpirarAcesso}
          />
        )}
        {!membro?.expiracao && (
          <>
            <InputCheckBox
              label="Tempo de expiração"
              checked={checkExpiracao}
              setChecked={setCheckExpiracao}
            />

            {checkExpiracao && (
              <InputText
                label="Tempo de expiração em minutos"
                text={tempoExpiracao}
                setText={setTempoExpiracao}
                type={TypeText.Number}
              />
            )}
          </>
        )}
        {erroMsg && <ErrorText text={erroMsg} />}
        <FncButton title="Alterar Usuario" onClick={alteraUsuario} />
      </div>
    </>
  );
};

export default EditMembro;
