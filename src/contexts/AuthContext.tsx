import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api/api";

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
  inicializando: boolean;
  login: (tokenData: TokenData) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

let refreshEmAndamento: Promise<string | null> | null = null;

const BASE_URL = import.meta.env.BASE_URL;

export function AuthProvider({ children }: AuthProviderProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [user, setUserObj] = useState<User | null>(null);
  const [inicializando, setInicializando] = useState(true);

  const tokenRef = useRef<string | null>(null);

  const authenticated =
    tokenData !== null && Date.now() < new Date(tokenData.expiration).getTime();

  function estaNaHome() {
    return (
      window.location.pathname === BASE_URL || window.location.pathname === "/"
    );
  }

  const executarRefresh = async (): Promise<string | null> => {
    // não faz refresh na home
    if (estaNaHome()) {
      return null;
    }

    const temUsuario = !!localStorage.getItem("user");

    if (!temUsuario) {
      return null;
    }

    if (refreshEmAndamento) {
      return refreshEmAndamento;
    }

    refreshEmAndamento = api
      .post("/Autenticacao/refresh")
      .then((resp) => {
        const novoToken: string = resp.data.token;
        const novaExpiracao: string = resp.data.expiracao;

        tokenRef.current = novoToken;

        setTokenData({
          token: novoToken,
          expiration: novaExpiracao,
        });

        return novoToken;
      })
      .catch(() => {
        _logout();
        return null;
      })
      .finally(() => {
        refreshEmAndamento = null;
      });

    return refreshEmAndamento;
  };

  useEffect(() => {
    const userStorage = localStorage.getItem("user");

    if (userStorage) {
      setUserObj(JSON.parse(userStorage));
    }

    // evita refresh na página inicial
    if (estaNaHome()) {
      setInicializando(false);
      return;
    }

    executarRefresh().finally(() => {
      setInicializando(false);
    });
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }

      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (erro) => {
        const requisicaoOriginal = erro.config;

        const ehRotaDeRefresh = requisicaoOriginal.url?.includes(
          "Autenticacao/refresh",
        );

        const ehRotaDeLogin =
          requisicaoOriginal.url?.includes("Autenticacao/login");
        const estaNaPaginaInicial = estaNaHome();

        if (
          erro.response?.status === 401 &&
          !requisicaoOriginal._retry &&
          !ehRotaDeRefresh &&
          !ehRotaDeLogin &&
          !estaNaPaginaInicial
        ) {
          requisicaoOriginal._retry = true;

          const novoToken = await executarRefresh();

          if (novoToken) {
            requisicaoOriginal.headers.Authorization = `Bearer ${novoToken}`;

            return api(requisicaoOriginal);
          }

          _logout();

          window.location.replace(BASE_URL);

          return Promise.reject(erro);
        }

        return Promise.reject(erro);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  function login(novoTokenData: TokenData) {
    tokenRef.current = novoTokenData.token;

    setTokenData(novoTokenData);
  }

  function _logout() {
    tokenRef.current = null;

    setTokenData(null);
    setUserObj(null);

    localStorage.removeItem("user");
  }

  function logout() {
    _logout();

    window.location.replace(BASE_URL);
  }

  function setUser(u: User) {
    setUserObj(u);

    localStorage.setItem("user", JSON.stringify(u));
  }

  return (
    <AuthContext.Provider
      value={{
        tokenData,
        user,
        authenticated,
        inicializando,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
