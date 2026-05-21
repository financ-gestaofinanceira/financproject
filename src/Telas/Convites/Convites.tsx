import React, { useContext, useEffect, useState } from "react";
import TitleText from "../../props/TitleText/TitleText";
import "./ConvitesStyle.css";
import LabelText from "../../props/LabelText/LabelText";
import FncTable, { type FncTableColumn } from "../../props/FncTable/FncTable";
import type {
  ConviteItem,
  ConviteResponse,
} from "../../models/Convite/ConviteResponse";
import api from "../.././services/api/apiConnect";
import Carregamento from "../../componentes/Carregamento/Carregamento";
import Modal from "../../componentes/Modal/Modal";
import { ConviteContext } from "../../contexts/ConviteContext";
import SubtitleText from "../../props/SubtitleText/SubtitleText";
import FncButton from "../../props/FncButton/FncButton";
import { TypeThemeButton } from "../../props/FncButton/TypeThemeButton";
import ErrorText from "../../props/ErrorText/ErrorText";
const Convites = () => {
  interface IConvite {
    id: number;
    conta: string;
    usuario: string;
    acesso: string;
    status: string;
    dtEnvio: string;
    dtExpiracao: string;
    convite: ConviteItem;
  }
  const { setConvite, convite, removeConvite } = useContext(ConviteContext);
  const colunas: FncTableColumn[] = [
    { header: "Conta", key: "conta" },
    { header: "Usuário", key: "usuario" },
    { header: "Acesso", key: "acesso" },
    { header: "Status", key: "status" },
    { header: "Data Envio", key: "dtEnvio" },
    { header: "Data Expiração", key: "dtExpiracao" },
  ];

  const typePermission = (value: number) => {
    switch (value) {
      case 0:
        return "Mestre";

      case 1:
        return "Administrador";

      default:
        return "Visualizador";
    }
  };

  const [convitesRecebidos, setConvitesRecebidos] =
    React.useState<IConvite[]>();

  const [convitesEnviados, setConvitesEnviados] = React.useState<IConvite[]>();
  const [modalInvite, setIsModalInvite] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);

  const [modalRevokeInvite, setIsModalRevokeInvite] = useState(false);

  const handleConviteClick = async (objetoDaLinha: any) => {
    setConvite(objetoDaLinha.convite);
    if (convite?.convite !== null) {
      setIsModalInvite(true);
      setConvitesRecebidos(undefined);
      setConvitesEnviados(undefined);
      await buscaConvites();
    }
  };

  const handleRevokeConviteClick = async (objetoDaLinha: any) => {
    setConvite(objetoDaLinha.convite);
    if (convite?.convite !== null) {
      setIsModalRevokeInvite(true);
      setConvitesRecebidos(undefined);
      setConvitesEnviados(undefined);
      await buscaConvites();
    }
  };

  const buscaConvites = async () => {
    try {
      const respConvitesRecebidos = await api<ConviteResponse>(
        `/Convites`,
        "GET",
        undefined,
      );

      const respConvitesEnviados = await api<ConviteResponse>(
        `/Convites?remetente=true`,
        "GET",
        undefined,
      );

      function dateConvert(value: string) {
        return new Date(value).toLocaleDateString("pt-BR");
      }

      const meusConvites: IConvite[] = [];

      if (respConvitesRecebidos.sucesso && respConvitesRecebidos.dados) {
        respConvitesRecebidos.dados.conteudo.map((invite) => {
          meusConvites.push({
            id: invite.convite.idConvite,
            conta: invite.conta.titulo,
            usuario: invite.usuarioRemetente.email,
            acesso: typePermission(invite.convite.acesso),
            status:
              invite.convite.aceito === null
                ? "Pendente"
                : invite.convite.aceito
                  ? "Aceito"
                  : "Recusado",

            dtEnvio: dateConvert(invite.convite.dataEnvio),
            dtExpiracao: dateConvert(invite.convite.dataExpiracao),
            convite: invite,
          });

          setConvitesRecebidos(meusConvites);
        });
      } else {
        setConvitesRecebidos([]);
      }

      const meusConvitesEnviados: IConvite[] = [];

      if (respConvitesEnviados.sucesso && respConvitesEnviados.dados) {
        respConvitesEnviados.dados.conteudo.map((invite) => {
          meusConvitesEnviados.push({
            id: invite.convite.idConvite,
            conta: invite.conta.titulo,
            usuario: invite.usuarioDestinatario.email,
            acesso: typePermission(invite.convite.acesso),
            status:
              invite.convite.aceito === null
                ? "Pendente"
                : invite.convite.aceito
                  ? "Aceito"
                  : "Recusado",

            dtEnvio: dateConvert(invite.convite.dataEnvio),
            dtExpiracao: dateConvert(invite.convite.dataExpiracao),
            convite: invite,
          });

          setConvitesEnviados(meusConvitesEnviados);
        });
      } else {
        setConvitesEnviados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    const carregar = async () => {
      await buscaConvites();
    };

    carregar();
  }, []);

  const entrarNaConta = async (value: boolean) => {
    try {
      const retorno = await api<ConviteResponse>(
        `/Convites/entrar?idConvite=${convite?.convite.idConvite}&aceito=${value}`,
        "POST",
        undefined,
      );

      if (retorno.sucesso && retorno.dados) {
        removeConvite();
        setIsModalInvite(false);
        buscaConvites();
      } else {
        setErroMsg(retorno!.erro!);
      }
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  const revogarConvite = async () => {
    try {
      const retorno = await api<string>(
        `/Convites/${convite?.convite.idConvite}/Revogar`,
        "POST",
        undefined,
      );

      if (retorno.sucesso && retorno.dados) {
        removeConvite();
        setIsModalRevokeInvite(false);
        buscaConvites();
      }
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  return (
    <>
      {convitesRecebidos !== undefined && convitesEnviados !== undefined ? (
        <>
          <div className="fnc-invite-title">
            <TitleText text="Meus Convites" />
            <LabelText text="Compartilhando futuro, construindo juntos!" />
          </div>

          <div className="fnc-tables-invite">
            <FncTable
              title="Recebidos"
              data={convitesRecebidos}
              columns={colunas}
              onRowClick={handleConviteClick}
            />

            <FncTable
              title="Enviados"
              data={convitesEnviados}
              columns={colunas}
              onRowClick={handleRevokeConviteClick}
            />
          </div>

          {modalInvite && (
            <Modal isOpen={modalInvite} onClose={() => setIsModalInvite(false)}>
              <>
                <div className="fnc-ctn-aceept-invite">
                  <TitleText text={convite!.conta!.titulo} />
                  <SubtitleText text="Deseja entrar na conta?" />
                  {erroMsg && <ErrorText text={erroMsg} />}
                  <div className="fnc-ctn-btn-invite-acept">
                    <FncButton
                      title="Aceitar"
                      icon="check"
                      onClick={async () => await entrarNaConta(true)}
                    />
                    <FncButton
                      title="Recusar"
                      icon="close"
                      thema={TypeThemeButton.Delete}
                      onClick={async () => await entrarNaConta(false)}
                    />
                  </div>
                </div>
              </>
            </Modal>
          )}

          {modalRevokeInvite && (
            <Modal
              isOpen={modalRevokeInvite}
              onClose={() => setIsModalRevokeInvite(false)}
            >
              <>
                <div className="fnc-ctn-aceept-invite">
                  <TitleText text={convite!.conta!.titulo} />
                  <SubtitleText text="Deseja revogar o convite?" />
                  <div className="fnc-ctn-btn-invite-acept">
                    <FncButton
                      title="Sim"
                      icon="check"
                      onClick={async () => await revogarConvite()}
                    />
                    <FncButton
                      title="Não"
                      icon="close"
                      thema={TypeThemeButton.Delete}
                      onClick={() => setIsModalRevokeInvite(false)}
                    />
                  </div>
                </div>
              </>
            </Modal>
          )}
        </>
      ) : (
        <Carregamento />
      )}
    </>
  );
};

export default Convites;
