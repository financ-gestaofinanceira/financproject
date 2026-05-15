import React, { useId } from "react";
import "./SubtitleTextStyle.css";
interface PropSubtitleText {
  text: string;
  color?: string;
  bold?: boolean;
  onClick?: () => void;
}
const SubtitleText: React.FC<PropSubtitleText> = ({
  text,
  color,
  bold,
  onClick,
}) => {
  const id = useId();
  return (
    <>
      <p
        onClick={onClick}
        id={id}
        className="fnc-subtitle-text"
        style={{
          color,
          fontWeight: bold ? "bold" : "normal",
        }}
      >
        {text}
      </p>
    </>
  );
};

export default SubtitleText;
