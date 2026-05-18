import "./FncButton.css";
import { TypeButton } from "./TypeButton";
import { TypeThemeButton } from "./TypeThemeButton";
interface PropFncButton {
  title?: string;
  type?: TypeButton;
  thema?: TypeThemeButton;
  disabled?: boolean;
  icon?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const FncButton: React.FC<PropFncButton> = ({
  title,
  thema = TypeThemeButton.Default,
  type = TypeButton.Button,
  disabled = false,
  icon,
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
            <span className="material-icons">{icon}</span>
            {title}
          </div>
        )}
      </button>
    </>
  );
};

export default FncButton;
