import InputColor from "../InputColor/InputColor";
import InputText from "../InputText/InputText";
import "./InputTextAndColorStyle.css";
import LabelText from "../LabelText/LabelText";
interface PropInputTextAndColor {
  label?: string;
  color: string;
  onChangeColor: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}
const InputTextAndColor: React.FC<PropInputTextAndColor> = ({
  label,
  color,
  onChangeColor,
  placeholder,
  text,
  setText,
}) => {
  console.log(label);
  return (
    <>
      <div className="fnc-ctn-txt-color">
        {label && <LabelText text={label} />}
        <div className="fnc-input-txt-color">
          <InputColor color={color} onChange={onChangeColor} />
          <InputText placeholder={placeholder} text={text} setText={setText} />
        </div>
      </div>
    </>
  );
};

export default InputTextAndColor;
