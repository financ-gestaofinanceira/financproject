import "./InputSelect.css";
import LabelText from "../LabelText/LabelText";

interface OpcaoSelect {
  label: string;
  value: string;
}

interface PropInputSelect {
  label?: string;
  opcoes: OpcaoSelect[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const InputSelect: React.FC<PropInputSelect> = ({
  label,
  opcoes,
  onChange,
  placeholder,
}) => {
  return (
    <div className="fnc-input-select">
      {label && <LabelText text={label} />}
      <div className="fnc-input-select__wrapper">
        <select onChange={(e) => onChange(e.target.value)} defaultValue="">
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {opcoes.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
        <span className="fnc-input-select__icon material-icons">
          expand_more
        </span>
      </div>
    </div>
  );
};

export default InputSelect;
