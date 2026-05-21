import api from "../../services/api/apiConnect";
import "./MovimentacaoesStyle.css";
import { useCallback, useContext, useEffect, useState } from "react";
import type {
  Categoria,
  GetMovimentacoes,
} from "../../models/Movimentacoes/GetMovimentacoes";
import Modal from "../../componentes/Modal/Modal";
import type { CategoriaResponse } from "../../models/Categorias/Categorias";
import TitleText from "../../props/TitleText/TitleText";
import FncButton from "../../props/FncButton/FncButton";
import Categorias from "../Categorias/Categorias";
import InputDate from "../../props/InputDate/InputDate";
import CheckBoxList from "../../props/CheckBoxList/CheckBoxList";
import { ContaContext } from "../../contexts/ContaContext";
import InputSelect from "../../props/InputSelect/InputSelect";
import CadMov from "./CadMov/CadMov";
import TabelaMovimentacao from "./Tabela/TabelaMovimentacao";
import { AuthContext } from "../../contexts/AuthContext";
import LabelText from "../../props/LabelText/LabelText";
import CadConvite from "./CadConvite/CadConvite";
import type { GetContaUsuario } from "../../models/ContasUsuarios/GetContaUsuario";

type Props = {};

const Movimentacoes: React.FC<Props> = ({}) => {
  const { conta, setContaUsuario, usuario } = useContext(ContaContext);
  const { user } = useContext(AuthContext);
  const [movimentacoes, setMovimentacoes] = useState<GetMovimentacoes>();
  const [isCadMovOpen, setIsCadMovOpen] = useState(false);
  const [isCadInvite, setIsCadInvite] = useState(false);

  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);
  const [isConcluido, setIsConcluido] = useState<Boolean | null>(null);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<number | null>(null);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);

  const [statusSelect, setStatusSelect] = useState("Todas");

  const getNow = (isEnd: boolean = false) => {
    const now = new Date();
    let date: Date;

    if (!isEnd) {
      date = new Date(now.getFullYear(), now.getMonth(), 1);
      date.setHours(0, 0, 0, 0);
    } else {
      date = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      date.setHours(23, 59, 59, 999);
    }

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const [dataInicial, setDataInicial] = useState(getNow(false));
  const [dataFinal, setDataFinal] = useState(getNow(true));

  const formataMoeda = (valor: number | undefined) => {
    if (valor === undefined) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const buscaCategorias = useCallback(async () => {
    try {
      const resposta = await api<CategoriaResponse>(
        `/Contas/${conta!.idConta}/Categorias`,
        "GET",
        undefined,
      );
      if (resposta.sucesso && resposta.dados) {
        setCategorias(resposta.dados);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, [conta!.idConta]);

  const buscaContaUsuario = useCallback(async () => {
    try {
      const resposta = await api<GetContaUsuario>(
        `/ContasUsuarios/${conta!.idConta}/associados?IdUsuario=${user!.id}`,
        "GET",
        undefined,
      );
      if (resposta.sucesso && resposta.dados) {
        console.log(resposta.dados);
        setContaUsuario(resposta.dados.conteudo[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar conta usuário:", error);
    }
  }, [conta!.idConta]);

  const formatarData = (dataUtc: string) => {
    const data = new Date(dataUtc);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const min = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  };

  const buscaMovimentacoes = useCallback(async () => {
    const toUTCISOString = (data: string) => new Date(data).toISOString();

    const params = new URLSearchParams({
      DthrMovimentacaoInicial: toUTCISOString(dataInicial),
      DthrMovimentacaoFinal: toUTCISOString(dataFinal),
    });

    categoriasSelecionadas.forEach((cat) => {
      params.append("IdCategoria", cat.toString());
    });

    if (isConcluido !== null) {
      params.append("Concluido", isConcluido.toString());
    }

    if (tipoMovimentacao !== null) {
      params.append("TipoMovimentacao", tipoMovimentacao.toString());
    }

    const url = `/Contas/${conta!.idConta}/Movimentacoes/Retornar?${params.toString()}`;

    try {
      const resposta = await api<GetMovimentacoes>(url, "GET", undefined);
      if (resposta.sucesso && resposta.dados) {
        setMovimentacoes(resposta.dados);
      }
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
    }
  }, [
    conta!.idConta,
    dataInicial,
    dataFinal,
    categoriasSelecionadas,
    isConcluido,
    tipoMovimentacao,
  ]);

  useEffect(() => {
    buscaContaUsuario();
    buscaCategorias();
    buscaMovimentacoes();
  }, [buscaCategorias, buscaMovimentacoes]);

  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <div>
          <TitleText text={`Transações - ${conta!.titulo}`} />
          <LabelText
            text={`Acesso: ${usuario?.permissao === 0 ? "Mestre" : usuario?.permissao === 1 ? "Administrador" : "Visualizador"} ${usuario?.expiracao ? ` - Expiração: ${formatarData(usuario?.expiracao)}` : ""} `}
          />
        </div>

        {usuario?.permissao !== 2 && (
          <>
            <div className="fnc-ctn-cads">
              <FncButton
                title="Nova Transação"
                onClick={() => setIsCadMovOpen(true)}
              />
              {usuario?.permissao === 0 && (
                <>
                  <FncButton
                    title="Novo Convite"
                    onClick={() => setIsCadInvite(true)}
                  />
                  <FncButton
                    title="Categorias"
                    onClick={() => setIsCategoriaOpen(true)}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="grid-cards">
        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-investimento">
              <span className="material-icons">account_balance</span>
            </div>
          </div>
          <div className="card-secundario__label">Saldo atual</div>
          <div className="card-secundario__valor" style={{ color: "#2B7FFF" }}>
            {formataMoeda(conta!.saldoAtual)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-investimento">
              <span className="material-icons">account_balance</span>
            </div>
          </div>
          <div className="card-secundario__label">Saldo Projetado</div>
          <div className="card-secundario__valor" style={{ color: "#0c42f5" }}>
            {formataMoeda(conta!.saldoProjetado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-receita">
              <span className="material-icons">trending_up</span>
            </div>
          </div>
          <div className="card-secundario__label">Receitas</div>
          <div className="card-secundario__valor" style={{ color: "#00D492" }}>
            {formataMoeda(conta!.entradaPendente)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__header">
            <div className="card-secundario__icon icon-despesa">
              <span className="material-icons">trending_down</span>
            </div>
          </div>
          <div className="card-secundario__label">Despesas</div>
          <div className="card-secundario__valor" style={{ color: "#FF4B4B" }}>
            {formataMoeda(conta!.saidaPendente)}
          </div>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card-secundario">
          <div className="card-secundario__label">Saldo no período</div>
          <div className="card-secundario__valor" style={{ color: "#2B7FFF" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.saldoRealizado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Saldo no projetado</div>
          <div className="card-secundario__valor" style={{ color: "#2B7FFF" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.saldoProjetado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Receitas no período</div>
          <div className="card-secundario__valor" style={{ color: "#00D492" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.entrada.projetado)}
          </div>
        </div>

        <div className="card-secundario">
          <div className="card-secundario__label">Despesas no período</div>
          <div className="card-secundario__valor" style={{ color: "#FF4B4B" }}>
            {formataMoeda(movimentacoes?.conteudo.resumo.saida.projetado)}
          </div>
        </div>
      </div>

      <Modal isOpen={isCadMovOpen} onClose={() => setIsCadMovOpen(false)}>
        <CadMov
          onClose={() => {
            setIsCadMovOpen(false);
            buscaMovimentacoes();
          }}
        />
      </Modal>

      <Modal isOpen={isCategoriaOpen} onClose={() => setIsCategoriaOpen(false)}>
        <Categorias
          idConta={conta!.idConta}
          buscaMovimentacoes={buscaMovimentacoes}
        />
      </Modal>

      <Modal isOpen={isCadInvite} onClose={() => setIsCadInvite(false)}>
        <CadConvite setIsCadInvite={setIsCadInvite} />
      </Modal>

      <div className="fnc-ctn-filter">
        <InputDate
          label="Data inicial"
          text={dataInicial}
          setText={setDataInicial}
        />
        <InputDate label="Data Final" text={dataFinal} setText={setDataFinal} />

        <CheckBoxList<Categoria>
          itens={[
            {
              idCategoria: 0,
              nome: "Sem categoria",
            } as Categoria,

            ...(categorias?.conteudo ?? []),
          ]}
          idKey="idCategoria"
          labelKey="nome"
          selecionados={categoriasSelecionadas}
          onChange={setCategoriasSelecionadas}
          label="Categorias"
        />

        <InputSelect
          label="Status"
          opcoes={[
            { label: "Todas", value: "Todas" },
            { label: "Pendente", value: "Pendente" },
            { label: "Concluído", value: "Concluido" },
          ]}
          value={statusSelect}
          onChange={(valor) => {
            setStatusSelect(valor);

            setIsConcluido(
              valor === "Todas" ? null : valor === "Pendente" ? false : true,
            );
          }}
        />

        <InputSelect
          label="Tipo Movimentação"
          opcoes={[
            { label: "Todas", value: "Todas" },
            { label: "Entrada", value: "Entrada" },
            { label: "Saída", value: "Saida" },
          ]}
          onChange={(valor) =>
            setTipoMovimentacao(
              valor === "Todas" ? null : valor === "Entrada" ? 0 : 1,
            )
          }
          value={
            tipoMovimentacao === null
              ? "Todas"
              : tipoMovimentacao === 0
                ? "Entrada"
                : "Saida"
          }
        />
      </div>

      {movimentacoes && (
        <TabelaMovimentacao
          movimentacao={movimentacoes}
          buscaMovimentacoes={buscaMovimentacoes}
          idConta={conta!.idConta}
        />
      )}
    </div>
  );
};

export default Movimentacoes;
