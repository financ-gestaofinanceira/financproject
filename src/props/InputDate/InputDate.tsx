import InputText from "../InputText/InputText";
import { TypeText } from "../InputText/TypeText";

import "./InputDateStyle.css";
interface PropInputDate {
  label?: string;
  text: string;
  setText: (value: string) => void;
}
const InputDate: React.FC<PropInputDate> = ({ label, text, setText }) => {
  return (
    <>
      <div className="fnc-input-date-group">
        <InputText
          type={TypeText.DateTime}
          label={label}
          text={text}
          setText={setText}
        />
      </div>
    </>
  );
};

export default InputDate;
