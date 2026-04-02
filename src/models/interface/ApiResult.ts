export interface ApiResult<T> {
    sucesso: boolean;  
    dados?: T;          
    erro?: string;     
    status?: number;    
}