import FncButton from "../../../props/FncButton/FncButton";
import { TypeButton } from "../../../props/FncButton/TypeButton";
import Conecta from "../../../services/api/apiConnect";
import ErrorText from "../../../props/ErrorText/ErrorText";
import TitleText from "../../../props/TitleText/TitleText";
import InputTextAndColor from "../../../props/InputTextAndColor/InputTextAndColor";
import "./CadContaStyle.css";
import { useState } from "react";

type conta = {
  titulo: string;
  cor: string;
};

type Props = {
  buscaContas: () => void;
  onClose: () => void;
};
function getTextColor(bgColor: string) {
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);

  // fórmula de luminância simplificada
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 186 ? "#000000" : "#FFFFFF";
}
const CadContas: React.FC<Props> = ({ buscaContas, onClose }) => {
  const [inputTitulo, setInputTitulo] = useState<string>("");
  const [color, setColor] = useState<string>("#314158");
  const [erroMsg, setErroMsg] = useState<string | undefined>(undefined);

  const criaConta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const request: conta = {
        titulo: inputTitulo,
        cor: color,
      };

      var resposta = await Conecta<string>("Contas", "POST", request);
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
        {inputTitulo && (
          <div className="fnc-name-conta" style={{ background: color }}>
            <p style={{ color: getTextColor(color) }}>{inputTitulo}</p>
          </div>
        )}

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
