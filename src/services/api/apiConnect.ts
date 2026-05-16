import type { ApiResult } from "../../models/interface/ApiResult";
import api from "./api";

async function executarRequisicao<T>(
  rota: string,
  metodo: string,
  objeto?: object,
) {
  switch (metodo) {
    case "POST":
      return await api.post<T>(rota, objeto);

    case "GET":
      return await api.get<T>(rota);

    case "PATCH":
      return await api.patch<T>(rota, objeto);

    case "DELETE":
      return await api.delete<T>(rota);

    default:
      throw new Error(`Método inválido: ${metodo}`);
  }
}

export default async function Conecta<T>(
  rota: string,
  metodo: string,
  objeto?: object,
): Promise<ApiResult<T>> {
  try {
    const resposta = await executarRequisicao<T>(rota, metodo, objeto);

    return {
      sucesso: true,
      dados: resposta.data,
    };
  } catch (erro: any) {
    // TOKEN EXPIRADO
    if (erro.response?.status === 401) {
      try {
        console.log("Tentando refresh token...");

        const refreshResponse = await api.post("/Autenticacao/refresh");

        const novoToken = refreshResponse.data.token;

        // tenta novamente
        const novaResposta = await executarRequisicao<T>(rota, metodo, objeto);

        return {
          sucesso: true,
          dados: novaResposta.data,
        };
      } catch {
        console.log("Refresh falhou");

        localStorage.removeItem("user");

        window.location.href = "/";

        return {
          sucesso: false,
          erro: "Sessão expirada",
          status: 401,
        };
      }
    }

    const msgErro =
      typeof erro.response?.data === "string"
        ? erro.response.data
        : erro.response?.data?.mensagem;

    return {
      sucesso: false,
      erro: msgErro,
      status: erro.response?.status,
    };
  }
}
