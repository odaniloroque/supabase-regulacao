import { Router } from 'express';
import { prisma } from '../services/prisma';
import { config } from '../config';

const router = Router();

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[HEALTH] ${message}`, data ? data : '');
  }
};

// Rota principal de health check
router.get('/', async (req, res) => {
  try {
    logDebug('Verificando saúde do sistema');
    
    // Verificar conexão com o banco de dados
    await prisma.$queryRaw`SELECT 1`;
    
    // Coletar informações do sistema
    const systemInfo = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: config.server.nodeEnv,
      timestamp: new Date().toISOString()
    };
    
    logDebug('Informações do sistema:', systemInfo);
    
    res.json({
      status: 'ok',
      timestamp: systemInfo.timestamp,
      system: systemInfo
    });
  } catch (error) {
    logDebug('Erro na verificação de saúde:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Erro ao verificar saúde do sistema',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Rota específica para verificação do banco de dados
router.get('/database', async (req, res) => {
  try {
    logDebug('Verificando conexão com o banco de dados');
    
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    
    logDebug(`Conexão com banco de dados OK (${responseTime}ms)`);
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        responseTime: `${responseTime}ms`
      }
    });
  } catch (error) {
    logDebug('Erro na verificação do banco de dados:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Erro ao conectar com o banco de dados',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

export default router; 