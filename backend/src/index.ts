import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import healthRoutes from './routes/health';
import pacienteRoutes from './routes/paciente';

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[SERVER] ${message}`, data ? data : '');
  }
};

// Log das variáveis de ambiente (apenas em desenvolvimento)
if (config.server.nodeEnv === 'development') {
  logDebug('Variáveis de ambiente carregadas:', {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'Definida' : 'Não definida',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'Definida' : 'Não definida',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Definida' : 'Não definida'
  });
}

const app = express();

logDebug('Configurando middleware CORS');
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));

logDebug('Configurando middleware JSON');
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

app.listen(PORT, () => {
  logDebug(`Servidor iniciado na porta ${PORT}`);
  logDebug('Ambiente:', config.server.nodeEnv);
  logDebug('URL do servidor:', `http://localhost:${PORT}`);
  logDebug('URL do health check:', `http://localhost:${PORT}/health`);
  logDebug('URL da API de pacientes:', `http://localhost:${PORT}/pacientes`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Promessa rejeitada não tratada:', error);
  process.exit(1);
}); 