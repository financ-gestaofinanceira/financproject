import SubtitleText from "../SubtitleText/SubtitleText";
import "./MsgtBoxStyle.css";
interface PropMsgtBox {
  title: string;
  description: string;
  colorTitle?: string;
  colorDescriptio?: string;
}
const MsgBox: React.FC<PropMsgtBox> = ({
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

export default MsgBox;
