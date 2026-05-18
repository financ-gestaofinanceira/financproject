import SubtitleText from "../SubtitleText/SubtitleText";
import "./SubtitleInteractiveStyle.css";

interface PropSubtitleInteractive {
  subtitle: string;
  textInteractive: string;
  color: string;
  onClick: () => void;
}
const SubtitleInteractive: React.FC<PropSubtitleInteractive> = ({
  subtitle,
  textInteractive,
  color,
  onClick,
}) => {
  return (
    <>
      <div className="fnc-interactive-text">
        <SubtitleText text={subtitle} />
        <SubtitleText
          text={textInteractive}
          color={color}
          bold={true}
          onClick={onClick}
        />
      </div>
    </>
  );
};

export default SubtitleInteractive;
