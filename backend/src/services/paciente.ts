import { supabase } from './supabase';
import { handleSupabaseError } from './supabase';
import { Paciente, CreatePacienteDTO, UpdatePacienteDTO } from '../types/paciente';
import { config } from '../config';

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[PACIENTE] ${message}`, data ? data : '');
  }
};

export const pacienteService = {
  // Listar todos os pacientes ativos
  async listar(): Promise<Paciente[]> {
    logDebug('Listando pacientes');
    const { data, error } = await supabase
      .from('paciente')
      .select('*')
      .eq('is_active', true)
      .order('nome');

    if (error) {
      logDebug('Erro ao listar pacientes:', error);
      throw error;
    }

    logDebug(`${data.length} pacientes encontrados`);
    return data;
  },

  // Buscar paciente por ID
  async buscarPorId(id: number): Promise<Paciente | null> {
    logDebug(`Buscando paciente com ID ${id}`);
    const { data, error } = await supabase
      .from('paciente')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logDebug('Erro ao buscar paciente:', error);
      throw error;
    }

    logDebug('Paciente encontrado:', data);
    return data;
  },

  // Buscar paciente por cartão SUS
  async buscarPorCartaoSus(cartaoSus: string): Promise<Paciente | null> {
    logDebug(`Buscando paciente com cartão SUS ${cartaoSus}`);
    const { data, error } = await supabase
      .from('paciente')
      .select('*')
      .eq('cartao_sus', cartaoSus)
      .single();

    if (error) {
      logDebug('Erro ao buscar paciente:', error);
      throw error;
    }

    logDebug('Paciente encontrado:', data);
    return data;
  },

  // Criar novo paciente
  async criar(paciente: CreatePacienteDTO, userId: string): Promise<Paciente> {
    logDebug('Criando novo paciente:', paciente);
    const { data, error } = await supabase
      .from('paciente')
      .insert({
        ...paciente,
        created_by: userId,
        updated_by: userId
      })
      .select()
      .single();

    if (error) {
      logDebug('Erro ao criar paciente:', error);
      throw error;
    }

    logDebug('Paciente criado com sucesso:', data);
    return data;
  },

  // Atualizar paciente
  async atualizar(id: number, paciente: UpdatePacienteDTO, userId: string): Promise<Paciente> {
    logDebug(`Atualizando paciente ${id}:`, paciente);
    const { data, error } = await supabase
      .from('paciente')
      .update({
        ...paciente,
        updated_by: userId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logDebug('Erro ao atualizar paciente:', error);
      throw error;
    }

    logDebug('Paciente atualizado com sucesso:', data);
    return data;
  },

  // Desativar paciente (soft delete)
  async desativar(id: number, userId: string): Promise<Paciente> {
    logDebug(`Desativando paciente ${id}`);
    const { data, error } = await supabase
      .from('paciente')
      .update({
        is_active: false,
        updated_by: userId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logDebug('Erro ao desativar paciente:', error);
      throw error;
    }

    logDebug('Paciente desativado com sucesso:', data);
    return data;
  }
}; 