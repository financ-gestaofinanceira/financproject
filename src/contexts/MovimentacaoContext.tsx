import { createContext, useContext, useState, type ReactNode } from "react";
import type { Movimentacao } from "../models/Movimentacoes/GetMovimentacoes";

type MovimentacaoContextType = {
  movimentacao: Movimentacao | null;
  setMovimentacao: (movimentacao: Movimentacao) => void;
  removeMovimentacao: () => void;
};

type MovimentacaoProviderProps = {
  children: ReactNode;
};

export const MovimentacaoContext = createContext({} as MovimentacaoContextType);

export function MovimentacaoProvider({ children }: MovimentacaoProviderProps) {
  const [movimentacao, setMovimentacaoObj] = useState<Movimentacao | null>(
    null,
  );

  function setMovimentacao(movimentacao: Movimentacao) {
    setMovimentacaoObj(movimentacao);
  }

  function removeMovimentacao() {
    setMovimentacaoObj(null);
  }

  return (
    <MovimentacaoContext.Provider
      value={{ movimentacao, setMovimentacao, removeMovimentacao }}
    >
      {children}
    </MovimentacaoContext.Provider>
  );
}

export function useMovimentacao() {
  return useContext(MovimentacaoContext);
}
