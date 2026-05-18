import React, { useId } from "react";
import "./TitleTextStyle.css";
interface PropTitleText {
  text: string;
}
const TitleText: React.FC<PropTitleText> = ({ text }) => {
  const id = useId();
  return (
    <>
      <h1 className="fnc-title" id={id}>
        {text}
      </h1>
    </>
  );
};

export default TitleText;
