import React, { useId } from "react";
import { TypeText } from "./TypeText";
import "./InputTextStyle.css";
interface PropInputText {
  label?: string;
  text: string;
  placeholder: string;
  type?: TypeText;
  maxLenght?: number;
  setText: (value: string) => void;
}
const InputText: React.FC<PropInputText> = ({
  label,
  text,
  type = TypeText.Text,
  maxLenght = undefined,
  placeholder,
  setText,
}) => {
  const id = useId();
  return (
    <>
      <div className="fnc-input-group">
        {label && <label htmlFor={id}>{label}</label>}
        <input
          type={type}
          id={id}
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
