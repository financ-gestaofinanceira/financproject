import "./LabelTextStyle.css";
interface PropLabelText {
  text: string;
  centerlize?: boolean;
}
const LabelText: React.FC<PropLabelText> = ({ text, centerlize = false }) => {
  return (
    <>
      <label className={centerlize ? "fnc-lbl-centerlize" : `fnc-lbl`}>
        {text}
      </label>
    </>
  );
};

export default LabelText;
