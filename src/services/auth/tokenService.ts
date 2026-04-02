import { Global } from "../../models/Autenticação/global";
import type { tokeRequest } from "../../models/Autenticação/tokenRequest";
import type { TokenResponse } from "../../models/Autenticação/TokenResponse";
import type { ApiResult } from "../../models/interface/ApiResult";
import api from "../api/apiConnect";

export async function GeraToken(request:tokeRequest) : Promise<ApiResult<TokenResponse>>{
    let resposta = await api<TokenResponse>("Autenticacao/login","POST",request); 
    
    console.log(resposta)
      if(resposta.sucesso)
      Global.BEARER_TOKEN = resposta.dados!.token;
    
    return resposta;
}

export async function GeraRefreshToken() : Promise<ApiResult<TokenResponse>>{
    let resposta = await api<TokenResponse>("Autenticacao/refresh","POST",undefined);

    if(resposta.sucesso)
      Global.BEARER_TOKEN = resposta.dados!.token;
    console.log(Global.BEARER_TOKEN)
    return resposta;
}

export async function Logado() : Promise<boolean>{
 
    console.log(Global.BEARER_TOKEN)
    if(Global.BEARER_TOKEN === undefined){
       let resposta = await GeraRefreshToken();
       if(resposta.status === 401){
        return false;
       }
    }

    return true;
}