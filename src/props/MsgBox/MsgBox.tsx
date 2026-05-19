import React, { useState } from "react";
import "./MsgBoxStyle.css";
import { TypeMsgBox } from "./TypeMsgBox";
import Modal from "../../componentes/Modal/Modal";
import TitleText from "../TitleText/TitleText";
import FncButton from "../FncButton/FncButton";
import { TypeThemeButton } from "../FncButton/TypeThemeButton";
import LabelText from "../LabelText/LabelText";
interface PropMsgBox {
  title: string;
  description?: string;
  type: TypeMsgBox;
  centerlize?: boolean;
  onQuestion?: (value: boolean) => void;
}
const MsgBox: React.FC<PropMsgBox> = ({
  title,
  description,
  type,
  centerlize = false,
  onQuestion,
}) => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <>
          <div className="fnc-ctn-msgbox">
            <TitleText text={title} />
            {description && (
              <LabelText text={description} centerlize={centerlize} />
            )}
            {type === TypeMsgBox.Question ? (
              <>
                <div className="fnc-ctn-btn-invite-aceept">
                  <FncButton
                    title="Sim"
                    icon="check_small"
                    onClick={() => {
                      onQuestion ? onQuestion(true) : null;
                      setModalVisible(false);
                    }}
                  />
                  <FncButton
                    title="Não"
                    icon="close"
                    thema={TypeThemeButton.Delete}
                    onClick={() => {
                      onQuestion ? onQuestion(false) : null;
                      setModalVisible(false);
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <FncButton
                  title="Ok"
                  onClick={() => {
                    onQuestion ? onQuestion(true) : null;
                    setModalVisible(false);
                  }}
                />
              </>
            )}
          </div>
        </>
      </Modal>
    </>
  );
};

export default MsgBox;
