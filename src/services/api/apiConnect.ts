import type { ApiResult } from "../../models/interface/ApiResult";
import api from "./api";

// Essa função apenas executa a requisição e formata o resultado.
// O refresh token é tratado automaticamente pelo interceptor
// registrado no AuthProvider (AuthContext.tsx) — não precisa fazer nada aqui.
export default async function Conecta<T>(
  rota: string,
  metodo: string,
  objeto?: object,
): Promise<ApiResult<T>> {
  try {
    let resposta;

    switch (metodo) {
      case "POST":
        resposta = await api.post<T>(rota, objeto);
        break;
      case "GET":
        resposta = await api.get<T>(rota);
        break;
      case "PATCH":
        resposta = await api.patch<T>(rota, objeto);
        break;
      case "PUT":
        resposta = await api.put<T>(rota, objeto);
        break;
      case "DELETE":
        resposta = await api.delete<T>(rota);
        break;
      default:
        throw new Error(`Método inválido: ${metodo}`);
    }

    return {
      sucesso: true,
      dados: resposta.data,
    };
  } catch (erro: any) {
    // Se chegou aqui com 401, o interceptor do AuthContext já tentou
    // o refresh e não conseguiu — o usuário foi deslogado automaticamente.
    const msgErro =
      typeof erro.response?.data === "string"
        ? erro.response.data
        : erro.response?.data?.mensagem;

    console.log(msgErro);
    return {
      sucesso: false,
      erro: msgErro,
      status: erro.response?.status,
    };
  }
}
