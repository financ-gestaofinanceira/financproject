import { useEffect, useRef, useState } from "react";
import "./CheckBoxListStyle.css";
import LabelText from "../LabelText/LabelText";

interface PropCheckBoxList<T extends object> {
  itens: T[];
  idKey: keyof T;
  labelKey: keyof T;
  selecionados: number[];
  onChange: (ids: number[]) => void;
  label?: string;
  placeholder?: string;
}

function CheckBoxList<T extends object>({
  itens,
  idKey,
  labelKey,
  selecionados,
  onChange,
  label,
  placeholder = "Selecione...",
}: PropCheckBoxList<T>) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAberto(false);
        setBusca("");
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  useEffect(() => {
    if (aberto) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setBusca("");
    }
  }, [aberto]);

  const toggle = (id: number) => {
    const novosIds = selecionados.includes(id)
      ? selecionados.filter((s) => s !== id)
      : [...selecionados, id];
    onChange(novosIds);
  };

  const textoResumo = () => {
    if (selecionados.length === 0) return null;
    const nomes = itens
      .filter((item) => selecionados.includes(item[idKey] as number))
      .map((item) => String(item[labelKey]));
    if (nomes.length <= 2) return nomes.join(", ");
    return `${nomes[0]}, ${nomes[1]} +${nomes.length - 2}`;
  };

  const itensFiltrados = itens.filter((item) =>
    String(item[labelKey]).toLowerCase().includes(busca.toLowerCase()),
  );

  const resumo = textoResumo();

  return (
    <div className="fnc-cblist" ref={containerRef}>
      {label && <LabelText text={label} />}

      <div
        className={`fnc-cblist__trigger ${aberto ? "fnc-cblist__trigger--aberto" : ""}`}
        onClick={() => setAberto((v) => !v)}
      >
        <span
          className={`fnc-cblist__trigger-texto ${!resumo ? "fnc-cblist__trigger-texto--placeholder" : ""}`}
        >
          {resumo ?? placeholder}
        </span>

        <svg
          className={`fnc-cblist__chevron ${aberto ? "fnc-cblist__chevron--aberto" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {aberto && (
        <div className="fnc-cblist__dropdown">
          <div className="fnc-cblist__search-wrapper">
            <span className="fnc-cblist__search-icon material-icons">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              className="fnc-cblist__search"
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {busca && (
              <span
                className="fnc-cblist__search-clear material-icons"
                onClick={(e) => {
                  e.stopPropagation();
                  setBusca("");
                }}
              >
                close
              </span>
            )}
          </div>

          {itensFiltrados.length === 0 && (
            <p className="fnc-cblist__empty">Nenhum item encontrado</p>
          )}

          {itensFiltrados.map((item) => {
            const id = item[idKey] as number;
            const texto = String(item[labelKey]);
            const marcado = selecionados.includes(id);

            return (
              <div
                key={id}
                className={`fnc-cblist__item ${marcado ? "fnc-cblist__item--selecionado" : ""}`}
                onClick={() => toggle(id)}
              >
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() => toggle(id)}
                  onClick={(e) => e.stopPropagation()}
                  className="fnc-cblist__check"
                />
                <span className="fnc-cblist__item-texto">{texto}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CheckBoxList;
