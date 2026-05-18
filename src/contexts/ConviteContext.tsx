import { createContext, useContext, useState, type ReactNode } from "react";
import type { ConviteItem } from "../models/Convite/ConviteResponse";

type ConviteContextType = {
  convite: ConviteItem | null;
  setConvite: (convite: ConviteItem) => void;
  removeConvite: () => void;
};

type ConviteProviderProps = {
  children: ReactNode;
};

export const ConviteContext = createContext({} as ConviteContextType);

export function ConviteProvider({ children }: ConviteProviderProps) {
  const [convite, setConviteObj] = useState<ConviteItem | null>(null);

  function setConvite(convite: ConviteItem) {
    setConviteObj(convite);
  }

  function removeConvite() {
    setConviteObj(null);
  }

  return (
    <ConviteContext.Provider value={{ convite, setConvite, removeConvite }}>
      {children}
    </ConviteContext.Provider>
  );
}

export function useConvite() {
  return useContext(ConviteContext);
}
