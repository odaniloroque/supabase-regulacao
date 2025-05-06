import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configurações do servidor
const server = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3333,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Configurações do banco de dados
const database = {
  url: process.env.DATABASE_URL
};

// Validar configurações obrigatórias
if (!database.url) {
  throw new Error('DATABASE_URL é obrigatória');
}

export const config = {
  server,
  database
}; 