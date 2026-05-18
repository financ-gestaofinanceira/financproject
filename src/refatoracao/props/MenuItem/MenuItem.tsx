import "./MenuItemStyle.css";

interface PropMenuItem {
  title?: string;
  disabled?: boolean;
  icon: string;
  background?: string;
  onClick?: () => void;
}

const MenuItem: React.FC<PropMenuItem> = ({
  title,
  disabled = false,
  icon,
  background,
  onClick,
}) => {
  return (
    <div
      className={disabled ? "nav__item active" : "nav__item"}
      style={
        {
          "--hover-bg": background || "rgba(255, 255, 255, 0.05)",
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <span className="material-icons">{icon}</span>
      {title}
    </div>
  );
};

export default MenuItem;
