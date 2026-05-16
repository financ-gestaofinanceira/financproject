import type { tokeRequest } from "../../models/Autenticação/tokenRequest";
import type { TokenResponse } from "../../models/Autenticação/TokenResponse";
import type { ApiResult } from "../../models/interface/ApiResult";
import api from "../api/apiConnect";

export async function GeraToken(
  request: tokeRequest,
): Promise<ApiResult<TokenResponse>> {
  let resposta = await api<TokenResponse>(
    "Autenticacao/login",
    "POST",
    request,
  );

  return resposta;
}

export async function GeraRefreshToken(): Promise<ApiResult<TokenResponse>> {
  let resposta = await api<TokenResponse>(
    "Autenticacao/refresh",
    "POST",
    undefined,
  );

  return resposta;
}

export async function Logado(): Promise<boolean> {
  return false;
}
