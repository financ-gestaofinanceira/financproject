import type {
  ContaResponse,
  ContaBancaria,
} from "../../models/ContasUsuarios/GetContasUsuarios";
import TabelaMovimentacao from "./Tabela/TabelaMovimentacao";
import api from "../../services/api/apiConnect";
import "./MovimentacaoesStyle.css";
import { useCallback, useContext, useEffect, useState } from "react";
import type {
  Categoria,
  GetMovimentacoes,
} from "../../models/Movimentacoes/GetMovimentacoes";
import Modal from "../../componentes/Modal/Modal";
import CadMov from "./CadMov/CadMov";
import type { UsuarioResponse3 } from "../../models/Usuario/UsuarioResponse";
import type { CategoriaResponse } from "../../models/Categorias/Categorias";
import SubtitleText from "../../refatoracao/props/SubtitleText/SubtitleText";
import TitleText from "../../refatoracao/props/TitleText/TitleText";
import FncButton from "../../refatoracao/props/FncButton/FncButton";
import Categorias from "../Categorias/Categorias";
import InputDate from "../../refatoracao/props/InputDate/InputDate";
import CheckBoxList from "../../refatoracao/props/CheckBoxList/CheckBoxList";
import { ContaContext } from "../../contexts/ContaContext";
import InputSelect from "../../refatoracao/props/InputSelect/InputSelect";

type Props = {};

const Movimentacoes: React.FC<Props> = ({}) => {
  const { conta, setConta } = useContext(ContaContext);
  const [movimentacoes, setMovimentacoes] = useState<GetMovimentacoes>();
  const [isCadMovOpen, setIsCadMovOpen] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);
  const [isConcluido, setIsConcluido] = useState<Boolean | null>(null);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);
  // Helper para datas
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

  // 1. Busca de Categorias (Memorizada)
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

  // 3. Busca de Movimentações (Memorizada)
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
  ]);

  useEffect(() => {
    buscaCategorias();
    buscaMovimentacoes();
  }, [buscaCategorias, buscaMovimentacoes]);

  return (
    <div className="transacoes-container">
      <div className="transacoes-header">
        <div className="texto-superior">
          <SubtitleText text="Gerencie todas as suas movimentações" />
          <TitleText text={`Transações - ${conta!.titulo}`} />
        </div>

        <div className="fnc-ctn-cads">
          <FncButton
            title="Categorias"
            onClick={() => setIsCategoriaOpen(true)}
          />

          <FncButton
            title="Nova Transação"
            onClick={() => setIsCadMovOpen(true)}
          />
        </div>
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

      <hr />

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
          onClose={() => setIsCadMovOpen(false)}
          idConta={conta!.idConta}
          buscaMovimentacoes={buscaMovimentacoes}
        />
      </Modal>

      <Modal isOpen={isCategoriaOpen} onClose={() => setIsCategoriaOpen(false)}>
        <Categorias
          idConta={conta!.idConta}
          buscaMovimentacoes={buscaMovimentacoes}
        />
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
          onChange={(valor) =>
            setIsConcluido(
              valor === "Todas" ? null : valor === "Pendente" ? false : true,
            )
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
