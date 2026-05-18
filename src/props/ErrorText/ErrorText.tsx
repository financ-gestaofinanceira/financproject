import React, { useId } from "react";
import "./ErrorTextStyle.css";
interface PropErrorText {
  text: string;
}
const ErrorText: React.FC<PropErrorText> = ({ text }) => {
  const id = useId();
  return (
    <>
      <p id={id} className="fnc-error-text">
        {text}
      </p>
    </>
  );
};

export default ErrorText;
