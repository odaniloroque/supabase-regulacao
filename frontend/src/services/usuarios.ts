import { Usuario } from '../types/usuario';

class UsuariosService {
  private static instance: UsuariosService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  public static getInstance(): UsuariosService {
    if (!UsuariosService.instance) {
      UsuariosService.instance = new UsuariosService();
    }
    return UsuariosService.instance;
  }

  async listarUsuarios(): Promise<Usuario[]> {
    const response = await fetch(`${this.baseUrl}/usuarios`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao listar usuários');
    }

    return response.json();
  }

  async buscarUsuario(id: number): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar usuário');
    }

    return response.json();
  }

  async criarUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar usuário');
    }

    return response.json();
  }

  async atualizarUsuario(
    id: number,
    usuario: Partial<Omit<Usuario, 'id'>>
  ): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar usuário');
    }

    return response.json();
  }

  async excluirUsuario(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir usuário');
    }
  }
}

export const usuariosService = UsuariosService.getInstance(); 