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
  disable?: boolean;
  maxLenght?: number;
}
const InputTextAndColor: React.FC<PropInputTextAndColor> = ({
  label,
  color,
  onChangeColor,
  placeholder,
  text,
  setText,
  maxLenght,
  disable = false,
}) => {
  return (
    <>
      <div className="fnc-ctn-txt-color">
        {label && <LabelText text={label} />}
        <div className="fnc-input-txt-color">
          <InputColor
            disable={disable}
            color={color}
            onChange={onChangeColor}
          />
          <InputText
            disable={disable}
            placeholder={placeholder}
            text={text}
            setText={setText}
            maxLenght={maxLenght}
          />
        </div>
      </div>
    </>
  );
};

export default InputTextAndColor;
