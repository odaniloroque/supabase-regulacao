import { Router } from 'express';
import { supabase } from '../services/supabase';
import { handleSupabaseError } from '../services/supabase';
import { config } from '../config';

const router = Router();

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[DEBUG] ${message}`, data ? data : '');
  }
};

// Rota para verificar a saúde geral do sistema
router.get('/', async (req, res) => {
  logDebug('Iniciando verificação de saúde do sistema');
  
  try {
    logDebug('Tentando conectar ao Supabase');
    
    // Verifica a conexão com o Supabase
    const { data: dbStatus, error: dbError } = await supabase
      .from('health_check')
      .select('*')
      .limit(1);

    logDebug('Resposta do Supabase:', { dbStatus, dbError });

    if (dbError) {
      logDebug('Erro na conexão com o Supabase:', dbError);
      throw dbError;
    }

    // Informações do sistema
    const systemInfo = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: config.server.nodeEnv,
    };

    logDebug('Informações do sistema coletadas:', systemInfo);

    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        tables: dbStatus ? 'accessible' : 'no_tables',
      },
      system: systemInfo,
    };

    logDebug('Enviando resposta:', response);
    res.json(response);
  } catch (error) {
    logDebug('Erro capturado:', error);
    const { status, message } = handleSupabaseError(error);
    
    const errorResponse = {
      status: 'error',
      message,
      error: config.server.nodeEnv === 'development' ? error : undefined,
      timestamp: new Date().toISOString(),
    };

    logDebug('Enviando resposta de erro:', errorResponse);
    res.status(status).json(errorResponse);
  }
});

// Rota para verificar especificamente a conexão com o banco
router.get('/database', async (req, res) => {
  logDebug('Iniciando verificação específica do banco de dados');
  
  try {
    const startTime = Date.now();
    logDebug('Tentando conectar ao Supabase');
    
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1);

    const responseTime = Date.now() - startTime;
    logDebug('Resposta do Supabase:', { data, error, responseTime });

    if (error) {
      logDebug('Erro na conexão com o Supabase:', error);
      throw error;
    }

    const response = {
      status: 'ok',
      database: {
        status: 'connected',
        responseTime: `${responseTime}ms`,
        tables: data ? 'accessible' : 'no_tables',
      },
      timestamp: new Date().toISOString(),
    };

    logDebug('Enviando resposta:', response);
    res.json(response);
  } catch (error) {
    logDebug('Erro capturado:', error);
    const { status, message } = handleSupabaseError(error);
    
    const errorResponse = {
      status: 'error',
      message,
      error: config.server.nodeEnv === 'development' ? error : undefined,
      timestamp: new Date().toISOString(),
    };

    logDebug('Enviando resposta de erro:', errorResponse);
    res.status(status).json(errorResponse);
  }
});

export default router; 