import React from "react";
import LabelText from "../LabelText/LabelText";
import "./CtnFncMov.css";
import SubtitleText from "../SubtitleText/SubtitleText";
interface PropCtnFncMov {
  title: string;
  subtitle_1: string;
  value_1: string;
  type_1?: boolean;
  subtitle_2: string;
  value_2: string;
  type_2?: boolean;
  subtitle_3?: string;
  value_3?: string;
  type_3?: boolean;
}
const CtnFncMov: React.FC<PropCtnFncMov> = ({
  title,
  subtitle_1,
  value_1,
  type_1 = null,
  subtitle_2,
  value_2,
  type_2 = null,
  subtitle_3,
  value_3,
  type_3 = null,
}) => {
  return (
    <>
      <div className="fnc-card-mov ">
        <SubtitleText text={title} />
        <div className="fnc-sub-ctn-mov">
          <div className="fnc-sub-ctn-values">
            <LabelText text={subtitle_1} />
            <p
              className="fnc-lbl-mov"
              style={{
                color:
                  type_1 === null ? "#2B7FFF" : type_1 ? "#00D492" : "#FF4B4B",
              }}
            >
              {value_1}
            </p>
          </div>
          <div className="fnc-sub-ctn-values">
            <LabelText text={subtitle_2} />
            <p
              className="fnc-lbl-mov"
              style={{
                color:
                  type_2 === null ? "#2B7FFF" : type_2 ? "#00D492" : "#FF4B4B",
              }}
            >
              {value_2}
            </p>
          </div>
          {subtitle_3 !== null &&
            subtitle_3 !== undefined &&
            value_3 !== null && (
              <div className="fnc-sub-ctn-values">
                <LabelText text={subtitle_3} />
                <p
                  className="fnc-lbl-mov"
                  style={{
                    color:
                      type_3 === null
                        ? "#2B7FFF"
                        : type_3
                          ? "#00D492"
                          : "#FF4B4B",
                  }}
                >
                  {value_3}
                </p>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default CtnFncMov;
