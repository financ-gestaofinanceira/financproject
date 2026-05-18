import { createContext, useContext, useState, type ReactNode } from "react";
import type { ContaBancaria } from "../models/ContasUsuarios/GetContasUsuarios";
import type { ContaUsuario } from "../models/ContasUsuarios/GetContaUsuario";

type ContaContextType = {
  conta: ContaBancaria | null;
  usuario: ContaUsuario | null;
  setConta: (contaBancaria: ContaBancaria) => void;
  setContaUsuario: (contaUsuario: ContaUsuario) => void;
  removeContaUsuario: () => void;
  removeConta: () => void;
};

type ContaProviderProps = {
  children: ReactNode;
};

export const ContaContext = createContext({} as ContaContextType);

export function ContaProvider({ children }: ContaProviderProps) {
  const [conta, setContaObj] = useState<ContaBancaria | null>(null);
  const [usuario, setUsuarioObj] = useState<ContaUsuario | null>(null);

  function setConta(contaBancaria: ContaBancaria) {
    setContaObj(contaBancaria);
  }

  function setContaUsuario(contaUsuario: ContaUsuario) {
    setUsuarioObj(contaUsuario);
  }

  function removeConta() {
    setContaObj(null);
  }

  function removeContaUsuario() {
    setUsuarioObj(null);
  }

  return (
    <ContaContext.Provider
      value={{
        conta,
        usuario,
        setConta,
        setContaUsuario,
        removeConta,
        removeContaUsuario,
      }}
    >
      {children}
    </ContaContext.Provider>
  );
}

export function useConta() {
  return useContext(ContaContext);
}
