import api from "../../services/api/apiConnect";
import React, { useContext, useEffect } from "react";
import type {
  ContaUsuario,
  GetContaUsuario,
} from "../../models/ContasUsuarios/GetContaUsuario";
import type { FncTableColumn } from "../../props/FncTable/FncTable";
import "./MembrosStyle.css";
import TitleText from "../../props/TitleText/TitleText";
import LabelText from "../../props/LabelText/LabelText";
import FncTable from "../../props/FncTable/FncTable";
import { ContaContext } from "../../contexts/ContaContext";
import { AuthContext } from "../../contexts/AuthContext";
import MsgTextBox from "../../props/TextBox/MsgTextBox";
import FncButton from "../../props/FncButton/FncButton";

const Membros = () => {
  interface IMembros {
    id: string;
    email: string;
    acesso: string;
    status: string;
    dtExpiracao: string;
    usuario: ContaUsuario;
  }
  const { conta, usuario } = useContext(ContaContext);
  const { user } = useContext(AuthContext);

  const colunas: FncTableColumn[] = [
    { header: "Email", key: "email" },
    { header: "Acesso", key: "acesso" },
    { header: "Status", key: "status" },
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

  function dateConvert(value: string) {
    return new Date(value).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const [membros, setMembros] = React.useState<IMembros[]>([]);

  // const [erroMsg, setErroMsg] = useState<string | null>(null);

  const buscaContaUsuario = async () => {
    try {
      const membroConta: IMembros[] = [];

      const resposta = await api<GetContaUsuario>(
        `/ContasUsuarios/${conta!.idConta}/associados`,
        "GET",
        undefined,
      );
      if (resposta.sucesso && resposta.dados) {
        resposta.dados.conteudo
          .filter((members) => members.idUsuario !== user?.id)
          .map((members) => {
            console.log(members);
            membroConta.push({
              id: members.idUsuario,
              email: members.email,
              acesso: typePermission(members.permissao),
              status: members.status === 0 ? "Ativo" : "Inativo",
              dtExpiracao: members.expiracao
                ? dateConvert(members.expiracao)
                : "",
              usuario: members,
            });
          });
        setMembros(membroConta);
      }
    } catch (error) {
      console.error("Erro ao buscar conta usuário:", error);
    }
  };

  useEffect(() => {
    const carregar = async () => {
      await buscaContaUsuario();
    };

    carregar();
  }, []);

  return (
    <>
      <div className="fnc-members-title">
        <TitleText text={`Membros da ${conta?.titulo}`} />
        <LabelText
          text={`${user?.primeiroNome}, você é o ${typePermission(usuario!.permissao)} dessa conta!`}
        />
      </div>

      <div className="fnc-ctn-members">
        <div className="fnc-warning">
          {usuario?.expiracao && (
            <MsgTextBox
              title="! IMPORTANTE !"
              description={`Sua conta vai expirar: ${dateConvert(usuario?.expiracao ?? "")}`}
              colorTitle="#c90d0d"
            />
          )}
        </div>

        <FncTable title="Membros" data={membros} columns={colunas} />
        <div className="fnc-members-update">
          <div>
            <FncButton title="Atualizar" onClick={buscaContaUsuario} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Membros;
