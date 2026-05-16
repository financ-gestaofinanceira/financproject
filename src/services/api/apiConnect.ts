import axios from "axios";
import type { ApiResult } from "../../models/interface/ApiResult";

const api = axios.create({
  baseURL: "https://api.pldprojects.com.br/api", //
});

export default async function Conecta<T>(
  rota: string,
  metodo: string,
  objeto?: object,
  token?: string | null,
): Promise<ApiResult<T>> {
  try {
    const header = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;

    let resposta;

    switch (metodo) {
      case "POST":
        resposta = await api.post<T>(rota, objeto, {
          headers: header?.headers,
          withCredentials: true,
        });

        break;
      case "GET":
        resposta = await api.get<T>(rota, {
          headers: header?.headers,
          withCredentials: true,
        });

        break;
      case "PATCH":
        resposta = await api.patch<T>(rota, objeto, {
          headers: header?.headers,
          withCredentials: true,
        });

        break;
      case "DELETE":
        resposta = await api.delete<T>(rota, {
          headers: header?.headers,
          withCredentials: true,
        });

        break;
      default:
        throw new Error(`Método inválido: ${metodo}`);
    }
    return { sucesso: true, dados: resposta?.data };
  } catch (erro: any) {
    const msgErro =
      typeof erro.response.data === "string"
        ? erro.response.data
        : (erro.response.data as any)?.mensagem;
    return { sucesso: false, erro: msgErro, status: erro.response.status };
  }
}
