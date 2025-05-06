export type NivelAcesso = 'ADMIN' | 'SUPERVISOR' | 'OPERADOR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  cargo: string;
  nivelAcesso: NivelAcesso;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
} 