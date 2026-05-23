import "./MenuItemStyle.css";

interface PropMenuItem {
  title?: string;
  disabled?: boolean;
  icon: string;
  background?: string;
  onClick?: () => void;
  tooltip?: string;
}

const MenuItem: React.FC<PropMenuItem> = ({
  title,
  disabled = false,
  icon,
  background,
  onClick,
  tooltip,
}) => {
  return (
    <div
      className={`nav__item ${disabled ? "active" : ""} ${!title ? "nav__item--icone" : ""}`}
      style={
        {
          "--hover-bg": background || "rgba(255, 255, 255, 0.05)",
        } as React.CSSProperties
      }
      onClick={onClick}
      title={tooltip}
    >
      <span className="material-icons">{icon}</span>
      {title && <span className="nav__item-texto">{title}</span>}
    </div>
  );
};

export default MenuItem;
