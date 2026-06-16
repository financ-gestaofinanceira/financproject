import "./FncButton.css";
import { TypeButton } from "./TypeButton";
import { TypeThemeButton } from "./TypeThemeButton";
interface PropFncButton {
  title?: string;
  type?: TypeButton;
  thema?: TypeThemeButton;
  disabled?: boolean;
  icon?: string;
  colorIcon?: string | null;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const FncButton: React.FC<PropFncButton> = ({
  title,
  thema = TypeThemeButton.Default,
  type = TypeButton.Button,
  disabled = false,
  icon,
  colorIcon,
  onClick,
}) => {
  const selectTheme = () => {
    switch (thema) {
      case TypeThemeButton.Default:
        return "fnc-btn-default";
      case TypeThemeButton.Cancel:
        return "fnc-btn-cancel";
      case TypeThemeButton.Delete:
        return "fnc-btn-delete";
      case TypeThemeButton.Icon:
        return "fnc-btn-icon";
      case TypeThemeButton.Aceept:
        return "fnc-btn-aceept";
      default:
        return "fnc-btn-default";
    }
  };

  return (
    <>
      <button
        type={type}
        className={selectTheme()}
        disabled={disabled}
        onClick={onClick}
      >
        {!icon && title}
        {icon && (
          <div className="fnc-ctn-btn-icon">
            <span
              className="material-icons"
              style={colorIcon !== null ? { color: colorIcon } : undefined}
            >
              {icon}
            </span>
            {title}
          </div>
        )}
      </button>
    </>
  );
};

export default FncButton;
