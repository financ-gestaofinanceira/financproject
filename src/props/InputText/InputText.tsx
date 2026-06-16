import React, { useId } from "react";
import { TypeText } from "./TypeText";
import "./InputTextStyle.css";
import LabelText from "../LabelText/LabelText";
interface PropInputText {
  label?: string;
  text: string;
  placeholder?: string;
  type?: TypeText;
  maxLenght?: number;
  setText: (value: string) => void;
  disable?: boolean;
}
const InputText: React.FC<PropInputText> = ({
  label,
  text,
  type = TypeText.Text,
  maxLenght = undefined,
  placeholder,
  setText,
  disable,
}) => {
  const id = useId();
  return (
    <>
      <div className="fnc-input-group">
        {label && <LabelText text={label} />}
        <input
          type={type}
          id={id}
          disabled={disable ?? disable}
          placeholder={placeholder}
          value={text}
          maxLength={maxLenght}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </>
  );
};

export default InputText;
