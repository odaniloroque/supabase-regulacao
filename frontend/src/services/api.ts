import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export interface Paciente {
  id?: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes?: string;
  ativo: boolean;
}

export const pacienteService = {
  listar: async (): Promise<Paciente[]> => {
    const response = await api.get('/pacientes');
    return response.data;
  },

  buscarPorId: async (id: string): Promise<Paciente> => {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  },

  criar: async (paciente: Omit<Paciente, 'id'>): Promise<Paciente> => {
    const response = await api.post('/pacientes', paciente);
    return response.data;
  },

  atualizar: async (id: string, paciente: Omit<Paciente, 'id'>): Promise<Paciente> => {
    const response = await api.put(`/pacientes/${id}`, paciente);
    return response.data;
  },

  excluir: async (id: string): Promise<void> => {
    await api.delete(`/pacientes/${id}`);
  },
};

export default api; 