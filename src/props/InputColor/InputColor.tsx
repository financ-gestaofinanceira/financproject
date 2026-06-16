import "./InputColorStyle.css";
interface PropInputColor {
  color: string;
  disable?: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}
const InputColor: React.FC<PropInputColor> = ({
  color,
  disable = false,
  onChange,
}) => {
  return (
    <>
      <input
        disabled={disable ?? disable}
        className="fnc-input-color"
        type="color"
        value={color}
        style={{ background: color }}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export default InputColor;
