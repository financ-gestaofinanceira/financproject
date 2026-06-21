import { useCallback, useContext, useEffect, useState } from "react";
import { ContaContext } from "../../../contexts/ContaContext";
import { MovimentacaoContext } from "../../../contexts/MovimentacaoContext";
import TitleText from "../../../props/TitleText/TitleText";
import InputSelect from "../../../props/InputSelect/InputSelect";
import InputDate from "../../../props/InputDate/InputDate";
import CheckBoxList from "../../../props/CheckBoxList/CheckBoxList";
import InputText from "../../../props/InputText/InputText";
import InputPrice from "../../../props/InputPrice/InputPrice";
import FncTable from "../../../props/FncTable/FncTable";
import {
  Categoria,
  Movimentacao,
} from "../../../models/Movimentacoes/GetMovimentacoes";
import { CategoriaResponse } from "../../../models/Categorias/Categorias";
import api from "../../../services/api/apiConnect";
import "./MovimentacaoFixa.css";
import FncButton from "../../../props/FncButton/FncButton";
import { ApiResult } from "../../../models/interface/ApiResult";
import { TypeThemeButton } from "../../../props/FncButton/TypeThemeButton";
import ErrorText from "../../../props/ErrorText/ErrorText";

type Props = {};

// ── tipos ─────────────────────────────────────────────────────────────────────

export type MovimentacaoFixaItem = {
  id: number;
  tipo: number;
  dataInicio: string;
  dataFim: string;
  dataOcorrencia: string;
  ocorrenciaDiaria: any[];
  expirado: boolean;
  movimentacaoBase: import("../../../models/Movimentacoes/GetMovimentacoes").Movimentacao;
};

// ── constantes ────────────────────────────────────────────────────────────────

const diasSemana = [
  { id: 0, nome: "Domingo" },
  { id: 1, nome: "Segunda-feira" },
  { id: 2, nome: "Terça-feira" },
  { id: 3, nome: "Quarta-feira" },
  { id: 4, nome: "Quinta-feira" },
  { id: 5, nome: "Sexta-feira" },
  { id: 6, nome: "Sábado" },
];

const meses = [
  { label: "Janeiro", value: "1" },
  { label: "Fevereiro", value: "2" },
  { label: "Março", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Maio", value: "5" },
  { label: "Junho", value: "6" },
  { label: "Julho", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Setembro", value: "9" },
  { label: "Outubro", value: "10" },
  { label: "Novembro", value: "11" },
  { label: "Dezembro", value: "12" },
];

const diasPorMes: Record<string, number> = {
  "1": 31,
  "2": 28,
  "3": 31,
  "4": 30,
  "5": 31,
  "6": 30,
  "7": 31,
  "8": 31,
  "9": 30,
  "10": 31,
  "11": 30,
  "12": 31,
};

const tipoOcorrenciaLabel: Record<number, string> = {
  0: "Semanal",
  1: "Mensal",
  2: "Anual",
};

const diasSemanaMap: Record<number, string> = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
};

// ── helpers ───────────────────────────────────────────────────────────────────

/**
 * Converte uma data ISO Universal (UTC) vinda da API para local (UTC-3).
 * Formato retornado: YYYY-MM-DDTHH:mm
 */
const fromIsoToLocalStr = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  // Ajuste manual de -3 horas para o fuso de Brasília
  const localDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
};

const toUtc3 = (iso: string) =>
  new Date(new Date(iso).getTime() - 3 * 60 * 60 * 1000);

const formatDate = (iso: string) => {
  if (!iso) return "-";
  const d = toUtc3(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatDateAnual = (iso: string) => {
  if (!iso) return "-";
  const d = toUtc3(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const formatDatemes = (iso: string) => {
  if (!iso) return "-";
  return `Dia ${toUtc3(iso).getDate()}`;
};

// ── componente ────────────────────────────────────────────────────────────────

const MovimentacaoFixa: React.FC<Props> = () => {
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

  const { conta } = useContext(ContaContext);
  const { setMovimentacao } = useContext(MovimentacaoContext);

  // ── estados ───────────────────────────────────────────────────────────────

  const [dataInicial, setDataInicial] = useState(getNow(false));
  const [dataFinal, setDataFinal] = useState(getNow(true));
  const [ocorrencia, setOcorrencia] = useState("1");
  const [mes, setMes] = useState("1");
  const [dia, setDia] = useState("1");
  const [diasSemanaSelecionados, setDiasSemanaSelecionados] = useState<
    number[]
  >([1]);
  const [tipo, setTipo] = useState<string>("receita");
  const [categorias, setCategorias] = useState<CategoriaResponse>();
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);
  const [titulo, setTitulo] = useState("");
  const [obs, setObservacao] = useState("");
  const [preco, setPreco] = useState<number>(0);
  const [precoFormatado, setPrecoFormatado] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);
  const [idFixo, setIdFixo] = useState<number>();
  const [idMov, setIdMov] = useState<number>();
  const [fixas, setFixas] = useState<MovimentacaoFixaItem[]>([]);
  const [habilitaEdicao, setHabilitaEdicao] = useState(false);
  const [status] = useState(0);

  const dias = Array.from({ length: diasPorMes[mes] }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));

  // ── buscas ────────────────────────────────────────────────────────────────

  const buscaCategorias = useCallback(async () => {
    try {
      const resposta = await api<CategoriaResponse>(
        `/Contas/${conta!.idConta}/Categorias`,
        "GET",
        undefined,
      );
      if (resposta.sucesso && resposta.dados) setCategorias(resposta.dados);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, [conta!.idConta]);

  const buscaFixas = useCallback(async () => {
    try {
      const resposta = await api<{ conteudo: MovimentacaoFixaItem[] }>(
        `/Contas/${conta!.idConta}/Movimentacoes/Fixa`,
        "GET",
        undefined,
      );
      if (resposta.sucesso && resposta.dados)
        setFixas(resposta.dados.conteudo ?? []);
    } catch (error) {
      console.error("Erro ao buscar fixas:", error);
    }
  }, [conta!.idConta]);

  useEffect(() => {
    buscaCategorias();
    buscaFixas();
    if (Number(dia) > diasPorMes[mes]) setDia(String(diasPorMes[mes]));
  }, [buscaCategorias, buscaFixas, mes]);

  // ── row click ─────────────────────────────────────────────────────────────

  const handleRowClick = (row: Record<string, any>) => {
    const fixa = row._raw as MovimentacaoFixaItem;
    setOcorrencia(fixa.tipo.toString());

    // CORREÇÃO: Converter as datas ISO da API para o formato local (Brasil/SP)
    setDataInicial(fromIsoToLocalStr(fixa.dataInicio));
    setDataFinal(fromIsoToLocalStr(fixa.dataFim));

    setMovimentacao(fixa.movimentacaoBase);
    setTitulo(fixa.movimentacaoBase.titulo);
    setPreco(fixa.movimentacaoBase.valor);
    setPrecoFormatado(
      fixa.movimentacaoBase.valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    );
    setObservacao(fixa.movimentacaoBase.observacao ?? "");
    setCategoriasSelecionadas(
      fixa.movimentacaoBase.categorias.map((c) => c.idCategoria),
    );
    setTipo(fixa.movimentacaoBase.tipo === 0 ? "receita" : "despesa");

    // CORREÇÃO: Usar toUtc3 para pegar dia e mês corretos da ocorrência
    const dOcorrencia = toUtc3(fixa.dataOcorrencia);
    setDia(String(dOcorrencia.getDate()));
    setMes(String(dOcorrencia.getMonth() + 1));

    // CORREÇÃO: Carregar os dias da semana selecionados para o tipo 0
    if (fixa.tipo === 0) {
      setDiasSemanaSelecionados(fixa.ocorrenciaDiaria || []);
    }

    setIdFixo(fixa.id);
    setIdMov(fixa.movimentacaoBase.id);
    setErroMsg(undefined);
    setHabilitaEdicao(true);
  };

  // ── tabela ────────────────────────────────────────────────────────────────

  const tabelaDados = fixas.map((f) => ({
    _raw: f,
    titulo: f.movimentacaoBase.titulo,
    valor: f.movimentacaoBase.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    tipoMov: f.movimentacaoBase.tipo === 0 ? "Receita" : "Despesa",
    tipo: tipoOcorrenciaLabel[f.tipo] ?? f.tipo,
    dataInicio: formatDate(f.dataInicio),
    dataFim: formatDate(f.dataFim),
    dataOcorrencia:
      f.tipo !== 0
        ? f.tipo === 1
          ? formatDatemes(f.dataOcorrencia)
          : formatDateAnual(f.dataOcorrencia)
        : f.ocorrenciaDiaria.map((d) => diasSemanaMap[d]).join(", "),
  }));

  const tabelaColunas = [
    { header: "Titulo", key: "titulo" },
    { header: "Tipo Mov", key: "tipoMov" },
    { header: "Valor", key: "valor" },
    { header: "Tipo", key: "tipo" },
    { header: "Ocorrência", key: "dataOcorrencia" },
    { header: "Início", key: "dataInicio" },
    { header: "Fim", key: "dataFim" },
  ];

  // ── limpar ────────────────────────────────────────────────────────────────

  function limparCampos() {
    setCategoriasSelecionadas([]);
    setTitulo("");
    setObservacao("");
    setPrecoFormatado("");
    setPreco(0);
    setOcorrencia("1");
    setTipo("receita");
    setDataInicial(getNow(false));
    setDataFinal(getNow(true));
    setIdFixo(undefined);
    setIdMov(undefined);
    setMes("1");
    setDia("1");
    setDiasSemanaSelecionados([1]);
    setErroMsg(undefined);
  }

  // ── excluir ───────────────────────────────────────────────────────────────

  const reqRemovMovFixa = async () => {
    let erro: string | undefined = undefined;
    setIsLoading(true);
    setErroMsg(undefined);
    try {
      const resposta = await api<ApiResult<Movimentacao>>(
        `/Contas/${conta?.idConta}/Movimentacoes/Fixa/${idFixo}/Alterar${ocorrencia === "0" ? "/Diario" : ""}`,
        "PATCH",
        { status: 1 },
      );
      if (resposta.sucesso) {
        await buscaFixas();
        limparCampos();
        setHabilitaEdicao(false);
      } else {
        erro = resposta!.erro || "Erro ao excluir.";
        setErroMsg(erro);
      }
    } catch (error: any) {
      erro = error.message || "Erro inesperado.";
      setErroMsg(erro);
    } finally {
      setIsLoading(false);
    }
  };

  // ── cadastrar / editar ────────────────────────────────────────────────────

  const reqMovFixa = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setErroMsg(undefined);
    let erro: string | undefined = undefined;

    const toISOString = (data: string) => new Date(data).toISOString();

    try {
      if (!habilitaEdicao) {
        // ── cadastro ──────────────────────────────────────────────────────
        if (ocorrencia !== "0") {
          const request = {
            tipo: parseInt(ocorrencia),
            dataInicio: toISOString(dataInicial),
            dataFim: toISOString(dataFinal),
            dataOcorrencia: new Date(
              2026,
              Number(mes) - 1,
              Number(dia),
              12,
              0,
              0,
            ).toISOString(),
            movimentacao: {
              tipo: tipo === "receita" ? 0 : 1,
              valor: preco,
              titulo,
              observacao: obs,
              idsCategoria: categoriasSelecionadas,
            },
          };
          const resposta = await api<ApiResult<Movimentacao>>(
            `/Contas/${conta?.idConta}/Movimentacoes/Fixa`,
            "POST",
            request,
          );
          if (!resposta.sucesso) {
            erro = resposta!.erro || "Erro ao cadastrar movimentação.";
            setErroMsg(erro);
            return;
          }
        } else {
          const request = {
            dataInicio: toISOString(dataInicial),
            dataFim: toISOString(dataFinal),
            ocorrenciaDiaria: diasSemanaSelecionados,
            movimentacao: {
              tipo: tipo === "receita" ? 0 : 1,
              valor: preco,
              titulo,
              observacao: obs,
              idsCategoria: categoriasSelecionadas,
            },
          };
          const resposta = await api<ApiResult<Movimentacao>>(
            `/Contas/${conta?.idConta}/Movimentacoes/Fixa/Diarias`,
            "POST",
            request,
          );
          if (!resposta.sucesso) {
            erro = resposta!.erro || "Erro ao cadastrar movimentação.";
            setErroMsg(erro);
            return;
          }
        }
        await buscaFixas();
      } else {
        // ── edição: recorrência ───────────────────────────────────────────
        if (ocorrencia !== "0") {
          const request = {
            tipo: parseInt(ocorrencia),
            dataInicio: toISOString(dataInicial),
            dataFim: toISOString(dataFinal),
            dataOcorrencia: new Date(
              2026,
              Number(mes) - 1,
              Number(dia),
              12,
              0,
              0,
            ).toISOString(),
            status: status,
          };
          const resposta = await api<ApiResult<Movimentacao>>(
            `/Contas/${conta?.idConta}/Movimentacoes/Fixa/${idFixo}/Alterar`,
            "PATCH",
            request,
          );
          if (!resposta.sucesso) {
            erro = resposta!.erro || "Erro ao editar movimentação.";
            setErroMsg(erro);
            return;
          }
        } else {
          const request = {
            dataInicio: toISOString(dataInicial),
            dataFim: toISOString(dataFinal),
            ocorrenciaDiaria: diasSemanaSelecionados,
          };
          const resposta = await api<ApiResult<Movimentacao>>(
            `/Contas/${conta?.idConta}/Movimentacoes/Fixa/${idFixo}/Alterar/Diario`,
            "PATCH",
            request,
          );
          if (!resposta.sucesso) {
            erro = resposta!.erro || "Erro ao editar movimentação.";
            setErroMsg(erro);
            return;
          }
        }

        // ── edição: movimentação base ─────────────────────────────────────
        const requestEdit = {
          tipo: tipo === "receita" ? 0 : 1,
          valor: preco,
          titulo,
          observacao: obs,
        };
        const respostaEdit = await api<ApiResult<Movimentacao>>(
          `Contas/Movimentacoes/${idMov}/Alterar`,
          "PATCH",
          requestEdit,
        );
        if (!respostaEdit.sucesso) {
          erro = respostaEdit.erro || "Erro ao editar movimentação.";
          setErroMsg(erro);
          return;
        }

        // ── edição: categorias (só se mudaram) ────────────────────────────
        const fixa = fixas.find((f) => f.id === idFixo);
        const catOriginal =
          fixa?.movimentacaoBase.categorias.map((c) => c.idCategoria) ?? [];
        if (
          JSON.stringify([...catOriginal].sort()) !==
          JSON.stringify([...categoriasSelecionadas].sort())
        ) {
          const respostaCat = await api<ApiResult<Movimentacao>>(
            `Contas/Movimentacoes/${idMov}/Alterar/Categoria`,
            "PUT",
            { categorias: categoriasSelecionadas },
          );
          if (!respostaCat.sucesso) {
            erro = respostaCat.erro || "Erro ao atualizar categorias.";
            setErroMsg(erro);
            return;
          }
        }

        await buscaFixas();
      }
    } catch (error: any) {
      erro = error.message || "Erro inesperado.";
      setErroMsg(erro);
    } finally {
      setIsLoading(false);
      if (erro === undefined) {
        limparCampos();
        setHabilitaEdicao(false);
      }
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="mf-root">
      <TitleText text={`Movimentações Agendadas - ${conta!.titulo}`} />

      <section className="mf-section">
        <FncTable
          data={tabelaDados}
          columns={tabelaColunas}
          onRowClick={handleRowClick}
        />
      </section>

      <section className="mf-section">
        <h2 className="mf-section-title">Recorrência</h2>
        <div className="mf-group">
          <InputSelect
            label="Tipo de Ocorrência"
            opcoes={
              [{ label: "Mensal", value: "1" }]
              // ocorrencia === "0"
              //   ? [{ label: "Semanal", value: "0" }]
              //   : [
              //       ...((habilitaEdicao
              //         ? []
              //         : [{ label: "Semanal", value: "0" }]) as {
              //         label: string;
              //         value: string;
              //       }[]),
              //       { label: "Mensal", value: "1" },
              //       { label: "Anual", value: "2" },
              //     ]
            }
            value={ocorrencia}
            onChange={setOcorrencia}
          />
          <InputDate
            label="Data Inicial"
            text={dataInicial}
            setText={setDataInicial}
          />
          <InputDate
            label="Data Final"
            text={dataFinal}
            setText={setDataFinal}
          />
        </div>

        {ocorrencia === "0" && (
          <CheckBoxList
            itens={diasSemana}
            idKey="id"
            labelKey="nome"
            selecionados={diasSemanaSelecionados}
            onChange={setDiasSemanaSelecionados}
            label="Dias da Semana"
          />
        )}
        {ocorrencia === "1" && (
          <InputSelect
            label="Dia em que ocorrerá a movimentação"
            opcoes={dias}
            value={dia}
            onChange={setDia}
          />
        )}
        {ocorrencia === "2" && (
          <div className="mf-group">
            <InputSelect
              label="Mês"
              opcoes={meses}
              value={mes}
              onChange={setMes}
            />
            <InputSelect
              label="Dia"
              opcoes={dias}
              value={dia}
              onChange={setDia}
            />
          </div>
        )}
      </section>

      <section className="mf-section">
        <h2 className="mf-section-title">Movimentação</h2>

        <div className="fnc-transaction-type">
          <button
            type="button"
            className={`type-btn ${tipo === "receita" ? "active" : ""}`}
            data-type="receita"
            onClick={() => setTipo("receita")}
          >
            Receita
          </button>
          <button
            type="button"
            className={`type-btn ${tipo === "despesa" ? "active" : ""}`}
            data-type="despesa"
            onClick={() => setTipo("despesa")}
          >
            Despesa
          </button>
        </div>

        <div className="mf-group">
          <InputText
            label="Título"
            text={titulo}
            setText={setTitulo}
            placeholder="Ex: Salário"
          />
          <InputPrice
            label="Valor"
            formattedValue={precoFormatado}
            setFormattedValue={setPrecoFormatado}
            setValue={setPreco}
          />
        </div>

        <InputText label="Observação" text={obs} setText={setObservacao} />

        <CheckBoxList<Categoria>
          itens={[...(categorias?.conteudo ?? [])]}
          idKey="idCategoria"
          labelKey="nome"
          selecionados={categoriasSelecionadas}
          onChange={setCategoriasSelecionadas}
          label="Categorias"
        />

        {erroMsg && <ErrorText text={erroMsg} />}

        <FncButton
          title={habilitaEdicao ? "Editar Movimentação" : "Cadastrar"}
          onClick={reqMovFixa}
          disabled={isLoading}
        />

        {habilitaEdicao && (
          <>
            <FncButton
              title={"Cancelar Edição"}
              onClick={() => {
                setHabilitaEdicao(false);
                limparCampos();
              }}
              thema={TypeThemeButton.Cancel}
              disabled={isLoading}
            />
            <FncButton
              title={"Excluir"}
              onClick={reqRemovMovFixa}
              thema={TypeThemeButton.Delete}
              disabled={isLoading}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default MovimentacaoFixa;
