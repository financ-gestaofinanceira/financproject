import { createContext, useContext, useState, type ReactNode } from "react";
import type { ContaBancaria } from "../models/ContasUsuarios/GetContasUsuarios";

type ContaContextType = {
  conta: ContaBancaria | null;
  setConta: (contaBancaria: ContaBancaria) => void;
  removeConta: () => void;
};

type ContaProviderProps = {
  children: ReactNode;
};

export const ContaContext = createContext({} as ContaContextType);

export function ContaProvider({ children }: ContaProviderProps) {
  const [conta, setContaObj] = useState<ContaBancaria | null>(null);

  function setConta(contaBancaria: ContaBancaria) {
    setContaObj(contaBancaria);
  }

  function removeConta() {
    setContaObj(null);
  }

  return (
    <ContaContext.Provider value={{ conta, setConta, removeConta }}>
      {children}
    </ContaContext.Provider>
  );
}

export function useConta() {
  return useContext(ContaContext);
}
