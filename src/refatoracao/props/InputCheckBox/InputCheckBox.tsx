import LabelText from "../LabelText/LabelText";
import SubtitleText from "../SubtitleText/SubtitleText";
import "./InputCheckBoxStyle.css";
interface PropInputCheckBox {
  label: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
}
const InputCheckBox: React.FC<PropInputCheckBox> = ({
  label,
  checked,
  setChecked,
}) => {
  return (
    <>
      <div className="fnc-input-check-group">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <LabelText text={label} />
      </div>
    </>
  );
};

export default InputCheckBox;
