export interface Paciente {
  id: number;
  cartao_sus: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  nome_mae: string;
  nome_pai: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  is_active: boolean;
}

export interface CreatePacienteDTO {
  cartao_sus: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  nome_mae: string;
  nome_pai?: string;
}

export interface UpdatePacienteDTO {
  cartao_sus?: string;
  nome?: string;
  cpf?: string;
  data_nascimento?: string;
  nome_mae?: string;
  nome_pai?: string;
  is_active?: boolean;
} 