import "./LabelTextStyle.css";
interface PropLabelText {
  text: string;
}
const LabelText: React.FC<PropLabelText> = ({ text }) => {
  return (
    <>
      <label className="fnc-lbl">{text}</label>
    </>
  );
};

export default LabelText;
