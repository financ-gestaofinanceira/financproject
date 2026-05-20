import { createContext, useContext, useState, type ReactNode } from "react";
import type { ContaBancaria } from "../models/ContasUsuarios/GetContasBancarias";
import type { ContaUsuario } from "../models/ContasUsuarios/GetContaUsuario";

type ContaContextType = {
  conta: ContaBancaria | null;
  usuario: ContaUsuario | null;
  membro: ContaUsuario | null;
  setConta: (contaBancaria: ContaBancaria) => void;
  setContaUsuario: (contaUsuario: ContaUsuario) => void;
  setMembroConta: (contaUsuario: ContaUsuario) => void;
  removeMembroConta: () => void;
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
  const [membro, setMembroObj] = useState<ContaUsuario | null>(null);

  function setConta(contaBancaria: ContaBancaria) {
    setContaObj(contaBancaria);
  }

  function setContaUsuario(contaUsuario: ContaUsuario) {
    setUsuarioObj(contaUsuario);
  }

  function setMembroConta(contaUsuario: ContaUsuario) {
    setMembroObj(contaUsuario);
  }

  function removeConta() {
    setContaObj(null);
  }

  function removeMembroConta() {
    setMembroObj(null);
  }
  function removeContaUsuario() {
    setUsuarioObj(null);
  }

  return (
    <ContaContext.Provider
      value={{
        conta,
        usuario,
        membro,
        setConta,
        setContaUsuario,
        setMembroConta,
        removeMembroConta,
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
