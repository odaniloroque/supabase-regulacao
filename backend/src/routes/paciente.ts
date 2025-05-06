import { Router } from 'express';
import { pacienteService } from '../services/paciente';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/auth';
import { config } from '../config';

const router = Router();

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[PACIENTE_ROUTES] ${message}`, data ? data : '');
  }
};

// Listar todos os pacientes
router.get('/', async (req, res) => {
  logDebug('GET / - Listando pacientes');
  try {
    const pacientes = await pacienteService.listar();
    res.json(pacientes);
  } catch (error) {
    logDebug('Erro ao listar pacientes:', error);
    res.status(500).json({
      error: 'Erro ao listar pacientes',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Buscar paciente por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  logDebug(`GET /${id} - Buscando paciente`);
  
  try {
    const paciente = await pacienteService.buscarPorId(id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    logDebug('Erro ao buscar paciente:', error);
    res.status(500).json({
      error: 'Erro ao buscar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Buscar paciente por cartão SUS
router.get('/cartao-sus/:cartaoSus', async (req, res) => {
  const { cartaoSus } = req.params;
  logDebug(`GET /cartao-sus/${cartaoSus} - Buscando paciente`);
  
  try {
    const paciente = await pacienteService.buscarPorCartaoSus(cartaoSus);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    logDebug('Erro ao buscar paciente:', error);
    res.status(500).json({
      error: 'Erro ao buscar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Criar novo paciente (requer autenticação)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  logDebug('POST / - Criando paciente:', req.body);
  
  try {
    const paciente = await pacienteService.criar(req.body, req.user!.id);
    res.status(201).json(paciente);
  } catch (error) {
    logDebug('Erro ao criar paciente:', error);
    res.status(500).json({
      error: 'Erro ao criar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Atualizar paciente (requer autenticação)
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  logDebug(`PUT /${id} - Atualizando paciente:`, req.body);
  
  try {
    const paciente = await pacienteService.atualizar(id, req.body, req.user!.id);
    res.json(paciente);
  } catch (error) {
    logDebug('Erro ao atualizar paciente:', error);
    res.status(500).json({
      error: 'Erro ao atualizar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Desativar paciente (requer autenticação)
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);
  logDebug(`DELETE /${id} - Desativando paciente`);
  
  try {
    const paciente = await pacienteService.desativar(id, req.user!.id);
    res.json(paciente);
  } catch (error) {
    logDebug('Erro ao desativar paciente:', error);
    res.status(500).json({
      error: 'Erro ao desativar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

export default router; 