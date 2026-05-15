import "./InputColorStyle.css";
interface PropInputColor {
  color: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}
const InputColor: React.FC<PropInputColor> = ({ color, onChange }) => {
  return (
    <>
      <input
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
