import { createContext, use, useEffect, useState, type ReactNode } from "react";

export interface TokenData {
  token: string;
  expiration: string;
}

export type User = {
  id: string;
  primeiroNome: string;
  segundoNome: string;
  nomeCompleto: string;
  email: string;
};

type AuthContextType = {
  tokenData: TokenData | null;
  user: User | null;
  authenticated: boolean;
  login: (tokenData: TokenData) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [user, setUserObj] = useState<User | null>(null);

  const authenticated =
    tokenData !== null &&
    Date.now() < new Date(tokenData!.expiration).getTime();

  useEffect(() => {
    const userStorage = localStorage.getItem("user");

    if (userStorage) {
      const parsedUser: User = JSON.parse(userStorage);
      setUserObj(parsedUser);
    }
  }, []);

  function login(tokenData: TokenData) {
    setTokenData(tokenData);
  }

  function logout() {
    setTokenData(null);
    setUserObj(null);
    localStorage.removeItem("user");
  }

  function setUser(user: User) {
    setUserObj(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return (
    <AuthContext.Provider
      value={{
        tokenData,
        user,
        authenticated,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
