import api from "../../../services/api/apiConnect";
import type { ApiResult } from "../../../models/interface/ApiResult";
import type { Movimentacao } from "../../../models/Movimentacoes/GetMovimentacoes";
import type { CategoriaResponse } from "../../../models/Categorias/Categorias";
import { useContext, useState } from "react";
import TitleText from "../../../props/TitleText/TitleText";
import ErrorText from "../../../props/ErrorText/ErrorText";
import FncButton from "../../../props/FncButton/FncButton";
import { TypeButton } from "../../../props/FncButton/TypeButton";
import { TypeThemeButton } from "../../../props/FncButton/TypeThemeButton";
import "./ConclusaoMovimentacao.css";
import InputDate from "../../../props/InputDate/InputDate";
import InputCheckBox from "../../../props/InputCheckBox/InputCheckBox";
import Modal from "../../../componentes/Modal/Modal";
import { MovimentacaoContext } from "../../../contexts/MovimentacaoContext";
import CadMov from "../CadMov/CadMov";
import SubtitleText from "../../../props/SubtitleText/SubtitleText";

// "YYYY-MM-DDTHH:mm" (horário local do browser) → UTC ISO global
const toUTCISOString = (data: string): string => new Date(data).toISOString();

interface PropAlteraMov {
  onClose: () => void;
  idConta: number;
  buscaMovimentacoes: () => void;
  movimentacaoSelecionada: Movimentacao;
}

const ConclusaoMovimentacao: React.FC<PropAlteraMov> = ({
  onClose,
  buscaMovimentacoes,
  movimentacaoSelecionada,
}) => {
  // Hora atual no horário local do browser, formato "YYYY-MM-DDTHH:mm"
  const getNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  // UTC ISO → "YYYY-MM-DDTHH:mm" no horário local do browser
  const utcISOParaInput = (data: string) => {
    const d = new Date(data);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const { setMovimentacao } = useContext(MovimentacaoContext);
  const [usarDataMovimentacao, setUsarDataMovimentacao] = useState(false);
  const [dataConclusao, setDataConclusao] = useState(getNow);
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const toggleUsarDataMovimentacao = () => {
    const novo = !usarDataMovimentacao;
    setUsarDataMovimentacao(novo);
    setDataConclusao(
      novo
        ? utcISOParaInput(movimentacaoSelecionada.dthrMovimentacao)
        : getNow(),
    );
  };

  const [idMovAtual, setIdMovAtual] = useState<number>(
    movimentacaoSelecionada.id,
  );
  const [movAtual, setMovAtual] = useState<Movimentacao>(
    movimentacaoSelecionada,
  );

  const [alterarMovimentacao, setAlterarMovimentacao] = useState(false);

  const formataMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  // Materializa apenas para Concluir e Deletar — nunca para Alterar
  const materializar = async (): Promise<number | null> => {
    if (idMovAtual > 0) return idMovAtual;
    try {
      const resposta = await api<any>(
        `/Contas/${movimentacaoSelecionada.idConta}/Movimentacoes/Fixa/${movimentacaoSelecionada.idFixo}/Materializa`,
        "POST",
        {
          dataMovimentacao: toUTCISOString(
            movimentacaoSelecionada.dthrMovimentacao,
          ),
        },
      );
      if (resposta.sucesso && resposta.dados) {
        const mov: Movimentacao = resposta.dados.valor;
        setIdMovAtual(mov.id);
        setMovAtual(mov);
        return mov.id;
      } else {
        setErroMsg(resposta.erro || "Erro ao materializar movimentação.");
        return null;
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
      return null;
    }
  };

  // ── concluir / extornar ───────────────────────────────────────────────────

  const ExecutarMovRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(undefined);
    setIsLoading(true);
    try {
      const idMov = await materializar();
      if (idMov === null) return;

      const resposta = await api<ApiResult<CategoriaResponse>>(
        `/Contas/Movimentacoes/${idMov}/${movAtual.concluido ? "Extornar" : "Concluir"}`,
        "POST",
        movAtual.concluido
          ? undefined
          : { dthrConclusao: toUTCISOString(dataConclusao) },
      );

      if (resposta.sucesso) {
        buscaMovimentacoes();
        onClose();
      } else {
        setErroMsg(resposta.erro);
      }
    } catch (error: any) {
      setErroMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── deletar ───────────────────────────────────────────────────────────────

  const DeletarMovRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(undefined);
    setIsLoading(true);
    try {
      const idMov = await materializar();
      if (idMov === null) return;

      const resposta = await api<ApiResult<CategoriaResponse>>(
        `/Contas/Movimentacoes/${idMov}/Remover`,
        "DELETE",
        undefined,
      );

      if (resposta.sucesso) {
        buscaMovimentacoes();
        onClose();
      } else {
        setErroMsg(resposta.erro);
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── alterar — NÃO materializa; o CadMov cuida disso se necessário ─────────

  const AlterarMovimentacao = () => {
    // Passa a movimentação original para o contexto (com id=0 se for virtual)
    // O CadMov em modo edição detecta idFixo > 0 && id === 0 e materializa antes do PATCH
    setMovimentacao(movimentacaoSelecionada);
    setAlterarMovimentacao(true);
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="fnc-ctn-opt-mov">
      <TitleText text={`Alterar ${movimentacaoSelecionada.titulo}`} />
      <TitleText text={formataMoeda(movimentacaoSelecionada.valor)} />

      <div className="fnc-inputs-opt-mov">
        {erroMsg && <ErrorText text={erroMsg} />}

        {!movAtual.concluido && (
          <>
            <InputCheckBox
              checked={usarDataMovimentacao}
              label="Usar data da movimentação"
              setChecked={toggleUsarDataMovimentacao}
            />
            <InputDate
              text={dataConclusao}
              label="Data Conclusão"
              setText={setDataConclusao}
            />
          </>
        )}
        {movimentacaoSelecionada.id === 0 && (
          <SubtitleText text="Esta movimentação foi criada a partir de um agendamento. Alterações futuras no agendamento não afetarão esta movimentação." />
        )}
        <div className="fnc-edit-mov-ctn-vertical">
          <FncButton
            title={movAtual.concluido ? "Extornar" : "Concluir"}
            type={TypeButton.Submit}
            onClick={ExecutarMovRequest}
            disabled={isLoading}
          />
          <FncButton
            title="Deletar"
            type={TypeButton.Submit}
            onClick={DeletarMovRequest}
            thema={TypeThemeButton.Delete}
            disabled={isLoading}
          />
          <FncButton
            title="Alterar"
            type={TypeButton.Submit}
            onClick={AlterarMovimentacao}
            thema={TypeThemeButton.Aceept}
            disabled={isLoading}
          />
        </div>

        {alterarMovimentacao && (
          <Modal isOpen={true} onClose={() => setAlterarMovimentacao(false)}>
            <CadMov
              onClose={() => {
                setAlterarMovimentacao(false);
                buscaMovimentacoes();
                onClose();
              }}
              edit={true}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ConclusaoMovimentacao;
