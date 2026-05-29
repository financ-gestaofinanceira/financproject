import { useRef, useState } from "react";
import "./SelectListStyle.css";

interface SelectListProps<T extends object> {
  itens: T[];
  idKey: keyof T;
  labelKey: keyof T;
  selecionado: number | null;
  onSelect: (id: number, item: T) => void;
  label?: string;
  placeholder?: string;
}

function SelectList<T extends object>({
  itens,
  idKey,
  labelKey,
  selecionado,
  onSelect,
  label,
  placeholder = "Pesquisar...",
}: SelectListProps<T>) {
  const [busca, setBusca] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const itensFiltrados = itens.filter((item) =>
    String(item[labelKey]).toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="fnc-slist">
      {label && <label className="fnc-slist__label">{label}</label>}

      <div className="fnc-slist__container">
        {/* Barra de pesquisa */}
        <div className="fnc-slist__search-wrapper">
          <svg
            className="fnc-slist__search-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="fnc-slist__search"
            placeholder={placeholder}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <span
              className="fnc-slist__search-clear"
              onClick={() => {
                setBusca("");
                inputRef.current?.focus();
              }}
            >
              ✕
            </span>
          )}
        </div>

        {/* Tabela */}
        <div className="fnc-slist__lista">
          {itensFiltrados.length === 0 ? (
            <p className="fnc-slist__empty">Nenhum item encontrado</p>
          ) : (
            itensFiltrados.map((item) => {
              const id = item[idKey] as number;
              const texto = String(item[labelKey]);
              const ativo = selecionado === id;

              return (
                <div
                  key={id}
                  className={`fnc-slist__item ${ativo ? "fnc-slist__item--ativo" : ""}`}
                  onClick={() => onSelect(id, item)}
                >
                  <span className="fnc-slist__item-texto">{texto}</span>
                  {ativo && (
                    <svg
                      className="fnc-slist__item-check"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectList;
