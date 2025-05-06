import { Router } from 'express';
import { PacienteService } from '../services/paciente';
import { config } from '../config';

const router = Router();

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[PACIENTE-ROUTES] ${message}`, data ? data : '');
  }
};

// Listar todos os pacientes
router.get('/', async (req, res) => {
  try {
    logDebug('GET / - Listando todos os pacientes');
    const pacientes = await PacienteService.listarPacientes();
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
  try {
    const id = parseInt(req.params.id);
    logDebug(`GET /${id} - Buscando paciente por ID`);
    
    const paciente = await PacienteService.buscarPacientePorId(id);
    
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    res.json(paciente);
  } catch (error) {
    logDebug(`Erro ao buscar paciente ${req.params.id}:`, error);
    res.status(500).json({
      error: 'Erro ao buscar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Buscar pacientes por nome
router.get('/buscar/:nome', async (req, res) => {
  try {
    const nome = req.params.nome;
    logDebug(`GET /buscar/${nome} - Buscando pacientes por nome`);
    
    const pacientes = await PacienteService.buscarPacientesPorNome(nome);
    res.json(pacientes);
  } catch (error) {
    logDebug(`Erro ao buscar pacientes por nome ${req.params.nome}:`, error);
    res.status(500).json({
      error: 'Erro ao buscar pacientes',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Criar novo paciente
router.post('/', async (req, res) => {
  try {
    logDebug('POST / - Criando novo paciente:', req.body);
    
    // Validar dados obrigatórios
    const { nome, dataNascimento, cpf } = req.body;
    if (!nome || !dataNascimento || !cpf) {
      return res.status(400).json({
        error: 'Dados incompletos',
        details: 'Nome, data de nascimento e CPF são obrigatórios'
      });
    }
    
    const paciente = await PacienteService.criarPaciente(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    logDebug('Erro ao criar paciente:', error);
    res.status(500).json({
      error: 'Erro ao criar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Atualizar paciente
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logDebug(`PUT /${id} - Atualizando paciente:`, req.body);
    
    const paciente = await PacienteService.atualizarPaciente(id, req.body);
    res.json(paciente);
  } catch (error) {
    logDebug(`Erro ao atualizar paciente ${req.params.id}:`, error);
    res.status(500).json({
      error: 'Erro ao atualizar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

// Desativar paciente
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logDebug(`DELETE /${id} - Desativando paciente`);
    
    await PacienteService.desativarPaciente(id);
    res.status(204).send();
  } catch (error) {
    logDebug(`Erro ao desativar paciente ${req.params.id}:`, error);
    res.status(500).json({
      error: 'Erro ao desativar paciente',
      details: config.server.nodeEnv === 'development' ? error : undefined
    });
  }
});

export default router; 