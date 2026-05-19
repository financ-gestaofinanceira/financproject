import SubtitleText from "../SubtitleText/SubtitleText";
import "./MsgTextBoxStyle.css";
interface PropMsgtBox {
  title: string;
  description: string;
  colorTitle?: string;
  colorDescriptio?: string;
}
const MsgTextBox: React.FC<PropMsgtBox> = ({
  title,
  description,
  colorTitle,
  colorDescriptio,
}) => {
  return (
    <>
      <div className="fnc-test-box">
        <SubtitleText text={title} color={colorTitle} bold={true} />
        <SubtitleText text={description} color={colorDescriptio} />
      </div>
    </>
  );
};

export default MsgTextBox;
