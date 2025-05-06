import { PrismaClient } from '../generated/prisma';
import { config } from '../config';

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[PRISMA] ${message}`, data ? data : '');
  }
};

// Cliente Prisma singleton
const prisma = new PrismaClient({
  log: config.server.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Middleware para logging de queries
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  logDebug(`Query ${params.model}.${params.action} executada em ${after - before}ms`);
  
  return result;
});

// Função para conectar ao banco de dados
export async function connectDatabase() {
  try {
    await prisma.$connect();
    logDebug('Conexão com o banco de dados estabelecida com sucesso');
  } catch (error) {
    logDebug('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Função para desconectar do banco de dados
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logDebug('Conexão com o banco de dados encerrada com sucesso');
  } catch (error) {
    logDebug('Erro ao desconectar do banco de dados:', error);
    throw error;
  }
}

export { prisma }; 