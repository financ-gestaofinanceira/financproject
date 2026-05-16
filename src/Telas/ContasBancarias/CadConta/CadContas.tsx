import { useContext, useState } from "react";
import FncButton from "../../../refatoracao/props/FncButton/FncButton";
import { TypeButton } from "../../../refatoracao/props/FncButton/TypeButton";
import Conecta from "../../../services/api/apiConnect";
import { AuthContext } from "../../../contexts/AuthContext";
import ErrorText from "../../../refatoracao/props/ErrorText/ErrorText";
import TitleText from "../../../refatoracao/props/TitleText/TitleText";
import InputTextAndColor from "../../../refatoracao/props/InputTextAndColor/InputTextAndColor";
import "./CadContaStyle.css";

type conta = {
  titulo: string;
  cor: string;
};

type Props = {
  usaRefresh: () => void;
  buscaContas: () => void;
  onClose: () => void;
};

const CadContas: React.FC<Props> = ({ usaRefresh, buscaContas, onClose }) => {
  const { tokenData } = useContext(AuthContext);
  const [inputTitulo, setInputTitulo] = useState<string>("");
  const [color, setColor] = useState<string>("#314158");
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);

  const criaConta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usaRefresh();
      const request: conta = {
        titulo: inputTitulo,
        cor: color,
      };

      var resposta = await Conecta<string>(
        "Contas",
        "POST",
        request,
      );
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
      <TitleText text="Nova Conta" />
      <div className="fnc-cad-conta">
        <InputTextAndColor
          placeholder="Ex: Minha Conta"
          text={inputTitulo}
          setText={setInputTitulo}
          color={color}
          onChangeColor={setColor}
        />

        {erroMsg && <ErrorText text={erroMsg} />}

        <FncButton
          type={TypeButton.Submit}
          title="Cadastrar"
          onClick={criaConta}
        />
      </div>
    </>
  );
};

export default CadContas;
