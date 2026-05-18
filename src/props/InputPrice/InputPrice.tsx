import InputText from "../InputText/InputText";
import "./InputPriceStyle.css";
interface PropInputPrice {
  label?: string;
  formattedValue: string;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  setFormattedValue: React.Dispatch<React.SetStateAction<string>>;
}
const InputPrice: React.FC<PropInputPrice> = ({
  label,
  formattedValue,
  setValue,
  setFormattedValue,
}) => {
  const handleValor = (value: string) => {
    const numeros = value.replace(/\D/g, "");
    const valorNumerico = Number(numeros) / 100;
    const formatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorNumerico);
    setFormattedValue(formatado);
    setValue(valorNumerico);
  };

  return (
    <>
      <InputText
        placeholder="R$ 00,00"
        label={label}
        text={formattedValue}
        maxLenght={25}
        setText={handleValor}
      />
    </>
  );
};

export default InputPrice;
