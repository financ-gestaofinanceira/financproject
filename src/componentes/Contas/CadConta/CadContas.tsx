import { useState } from "react";
import "./CadContasStyle.css";
import api from "../../../services/api/apiConnect";

type conta = {
  titulo: string;
};

type Props = {
  usaRefresh: () => void;
  buscaContas: () => void;
  onClose: () => void;
};

const CadContas: React.FC<Props> = ({ usaRefresh, buscaContas, onClose }) => {
  const [inputTitulo, setInputTitulo] = useState<string>("");
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);

  const criaConta = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    try {
      await usaRefresh();
      const request: conta = {
        titulo: inputTitulo,
      };

      var resposta = await api<string>("Contas", "POST", request, true);
      console.log(resposta.erro);
      if (resposta.sucesso) {
        onClose();
        buscaContas();
      } else
        setErroMsg(
          resposta.erro === undefined ? "Titulo invalido!" : resposta.erro,
        );

      console.log(resposta);

      if (resposta.erro) {
        console.log(resposta.erro);
        setErroMsg(resposta.erro);
        return;
      }
    } catch (erro: any) {
      console.error(erro.message);
      setErroMsg(erro.message);
    }
  };

  return (
    <>
      <div className="modal-header">
        <h2>Nova Conta</h2>
      </div>
      <div className="modal-body">
        <form
          className="centraliza"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="input-group">
            <label>Nome da conta</label>
            <input
              type="text"
              placeholder="Ex: Meu banco"
              onChange={(e) => setInputTitulo(e.target.value)}
            />
          </div>
          <p className="error">{erroMsg}</p>
          <button type="submit" className="botão-transação" onClick={criaConta}>
            Cadastrar
          </button>
        </form>
      </div>
    </>
  );
};

export default CadContas;
