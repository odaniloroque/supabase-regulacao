import { Paciente } from '../types/paciente';

class PacientesService {
  private static instance: PacientesService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  public static getInstance(): PacientesService {
    if (!PacientesService.instance) {
      PacientesService.instance = new PacientesService();
    }
    return PacientesService.instance;
  }

  async listarPacientes(): Promise<Paciente[]> {
    const response = await fetch(`${this.baseUrl}/pacientes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao listar pacientes');
    }

    return response.json();
  }

  async buscarPaciente(id: number): Promise<Paciente> {
    const response = await fetch(`${this.baseUrl}/pacientes/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar paciente');
    }

    return response.json();
  }

  async criarPaciente(paciente: Omit<Paciente, 'id'>): Promise<Paciente> {
    const response = await fetch(`${this.baseUrl}/pacientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(paciente),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar paciente');
    }

    return response.json();
  }

  async atualizarPaciente(
    id: number,
    paciente: Partial<Omit<Paciente, 'id'>>
  ): Promise<Paciente> {
    const response = await fetch(`${this.baseUrl}/pacientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(paciente),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar paciente');
    }

    return response.json();
  }

  async excluirPaciente(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/pacientes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir paciente');
    }
  }
}

export const pacientesService = PacientesService.getInstance(); 