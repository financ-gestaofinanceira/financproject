import InputColor from "../InputColor/InputColor";
import InputText from "../InputText/InputText";
import "./InputTextAndColorStyle.css";
interface PropInputTextAndColor {
  color: string;
  onChangeColor: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}
const InputTextAndColor: React.FC<PropInputTextAndColor> = ({
  color,
  onChangeColor,
  placeholder,
  text,
  setText,
}) => {
  return (
    <>
      <div className="fnc-input-txt-color">
        <InputColor color={color} onChange={onChangeColor} />
        <InputText placeholder={placeholder} text={text} setText={setText} />
      </div>
    </>
  );
};

export default InputTextAndColor;
