// import React, { useEffect, useState, useCallback } from "react";
import api from "../../../services/api/apiConnect";
import type { ApiResult } from "../../../models/interface/ApiResult";
import type { Movimentacao } from "../../../models/Movimentacoes/GetMovimentacoes";
import type { CategoriaResponse } from "../../../models/Categorias/Categorias";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import TitleText from "../../../props/TitleText/TitleText";
import ErrorText from "../../../props/ErrorText/ErrorText";
import FncButton from "../../../props/FncButton/FncButton";
import { TypeButton } from "../../../props/FncButton/TypeButton";
import { TypeThemeButton } from "../../../props/FncButton/TypeThemeButton";
import "./ConclusaoMovimentacao.css";
import InputDate from "../../../props/InputDate/InputDate";

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
  const { tokenData } = useContext(AuthContext);

  const getNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const [dataConclusao, setDataConclusao] = useState(getNow);

  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);

  const formataMoeda = (valor: number) => {
    let moeda = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

    return moeda;
  };

  const ExecutarMovRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(undefined);

    try {
      const toUTCISOString = (data: string) => new Date(data).toISOString();
      const request = {
        dthrConclusao: toUTCISOString(dataConclusao),
      };

      const resposta = await api<ApiResult<CategoriaResponse>>(
        `/Contas/Movimentacoes/${movimentacaoSelecionada.id}/${movimentacaoSelecionada.concluido ? "Extornar" : "Concluir"}`,
        "POST",
        movimentacaoSelecionada.concluido ? undefined : request,
      );

      if (resposta.sucesso) {
        buscaMovimentacoes();
        onClose();
      } else {
        setErroMsg(resposta.erro || "Erro ao cadastrar categoria.");
      }
    } catch (error: any) {
      setErroMsg(error.message || "Erro inesperado.");
    }
  };

  const DeletarMovRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(undefined);

    try {
      const resposta = await api<ApiResult<CategoriaResponse>>(
        `/Contas/Movimentacoes/${movimentacaoSelecionada.id}/Remover`,
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
    }
  };
  return (
    <div className="centraliza">
      <TitleText text={`Alterar ${movimentacaoSelecionada.titulo}`} />
      <TitleText text={formataMoeda(movimentacaoSelecionada.valor)} />

      <div className="modal-body">
        {erroMsg && <ErrorText text={erroMsg} />}

        {!movimentacaoSelecionada.concluido && (
          <InputDate
            text={dataConclusao}
            label="Data Conclusão"
            setText={setDataConclusao}
          />
        )}

        <div className="fnc-edit-mov-ctn-vertical">
          <FncButton
            title={movimentacaoSelecionada.concluido ? "Extornar" : "Concluir"}
            type={TypeButton.Submit}
            onClick={ExecutarMovRequest}
          />
          <FncButton
            title="Deletar"
            type={TypeButton.Submit}
            onClick={DeletarMovRequest}
            thema={TypeThemeButton.Delete}
          />
        </div>
      </div>
    </div>
  );
};

export default ConclusaoMovimentacao;
