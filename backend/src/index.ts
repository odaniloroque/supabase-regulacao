import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import healthRoutes from './routes/health';
import pacienteRoutes from './routes/paciente';
import { connectDatabase, disconnectDatabase } from './services/prisma';

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[SERVER] ${message}`, data ? data : '');
  }
};

// Log das variáveis de ambiente (apenas em desenvolvimento)
if (config.server.nodeEnv === 'development') {
  logDebug('Variáveis de ambiente carregadas:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'Definida' : 'Não definida',
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
  });
}

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rotas
logDebug('Registrando rotas de health check');
app.use('/health', healthRoutes);

logDebug('Registrando rotas de paciente');
app.use('/pacientes', pacienteRoutes);

// Middleware de erro global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logDebug('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: config.server.nodeEnv === 'development' ? err.message : undefined
  });
});

const PORT = config.server.port;

// Inicializar o servidor
async function startServer() {
  try {
    logDebug('Conectando ao banco de dados');
    await connectDatabase();
    
    app.listen(PORT, () => {
      logDebug(`Servidor iniciado na porta ${PORT}`);
      logDebug('Ambiente:', config.server.nodeEnv);
      logDebug('URL do servidor:', `http://localhost:${PORT}`);
      logDebug('URL do health check:', `http://localhost:${PORT}/health`);
      logDebug('URL da API de pacientes:', `http://localhost:${PORT}/pacientes`);
    });
  } catch (error) {
    logDebug('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();

// Tratamento de erros não capturados
process.on('uncaughtException', async (error) => {
  console.error('Erro não capturado:', error);
  await disconnectDatabase();
  process.exit(1);
});

process.on('unhandledRejection', async (error) => {
  console.error('Promessa rejeitada não tratada:', error);
  await disconnectDatabase();
  process.exit(1);
}); 