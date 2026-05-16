import { useState } from "react";
import type { UsuarioResponse3 } from "../../models/Usuario/UsuarioResponse";
import "./LanBotStyle.css";

interface LandBotProp {
  usuario: UsuarioResponse3;
}

const LandBotComponent: React.FC<LandBotProp> = ({ usuario }) => {
  const [open, setOpen] = useState(false);

  const url = `https://landbot.online/v3/H-3392854-GYSZPFDTDXM42H5N/index.html?name=${encodeURIComponent(
    usuario.nomeCompleto,
  )}&email=${encodeURIComponent(usuario.email)}`;

  return (
    <>
      <button onClick={() => setOpen(true)} className="landbot-button">
        💬
      </button>

      {open && (
        <div className="landbot-overlay">
          <div className="landbot-modal">
            <div className="cnt_close">
              <button onClick={() => setOpen(false)} className="close-button">
                <span className="material-icons">close</span>
              </button>
            </div>

            <iframe
              src={url}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LandBotComponent;
