import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[SUPABASE] ${message}`, data ? data : '');
  }
};

// Tipos para as tabelas do Supabase
export type Database = {
  public: {
    Tables: {
      // Aqui você definirá os tipos das suas tabelas
      // Exemplo:
      // users: {
      //   Row: {
      //     id: string
      //     name: string
      //     email: string
      //   }
      //   Insert: {
      //     name: string
      //     email: string
      //   }
      //   Update: {
      //     name?: string
      //     email?: string
      //   }
      // }
    }
  }
}

logDebug('Inicializando cliente Supabase');

// Cliente para operações públicas (anônimas)
export const supabase: SupabaseClient<Database> = createClient<Database>(
  config.supabase.url!,
  config.supabase.anonKey!
);

logDebug('Cliente público inicializado');

// Cliente para operações administrativas (com service role)
export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(
  config.supabase.url!,
  config.supabase.serviceRoleKey!
);

logDebug('Cliente administrativo inicializado');

// Função auxiliar para tratamento de erros do Supabase
export const handleSupabaseError = (error: any) => {
  logDebug('Tratando erro do Supabase:', error);
  
  if (error.code === '23505') {
    logDebug('Erro de chave duplicada detectado');
    return {
      status: 409,
      message: 'Registro já existe'
    };
  }

  if (error.code === '23503') {
    logDebug('Erro de chave estrangeira detectado');
    return {
      status: 400,
      message: 'Registro referenciado não existe'
    };
  }

  logDebug('Erro genérico do Supabase');
  return {
    status: 500,
    message: 'Erro interno do servidor'
  };
}; 