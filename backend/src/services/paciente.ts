import { prisma } from './prisma';
import { config } from '../config';
import { Prisma } from '@prisma/client';

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[PACIENTE] ${message}`, data ? data : '');
  }
};

// Tipo para os dados de criação de paciente
type CreatePacienteData = Omit<Prisma.PacienteCreateInput, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para os dados de atualização de paciente
type UpdatePacienteData = Partial<CreatePacienteData>;

export class PacienteService {
  // Listar todos os pacientes
  static async listarPacientes() {
    logDebug('Listando todos os pacientes');
    return prisma.paciente.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' }
    });
  }

  // Buscar paciente por ID
  static async buscarPacientePorId(id: number) {
    logDebug(`Buscando paciente com ID: ${id}`);
    return prisma.paciente.findUnique({
      where: { id }
    });
  }

  // Buscar paciente por CPF
  static async buscarPacientePorCpf(cpf: string) {
    logDebug(`Buscando paciente com CPF: ${cpf}`);
    return prisma.paciente.findUnique({
      where: { cpf }
    });
  }

  // Criar novo paciente
  static async criarPaciente(data: CreatePacienteData) {
    logDebug('Criando novo paciente:', data);
    
    // Converter a data de nascimento para DateTime
    const pacienteData = {
      ...data,
      dataNascimento: new Date(data.dataNascimento)
    };

    return prisma.paciente.create({
      data: pacienteData
    });
  }

  // Atualizar paciente
  static async atualizarPaciente(id: number, data: UpdatePacienteData) {
    logDebug(`Atualizando paciente ${id}:`, data);
    
    // Converter a data de nascimento se estiver presente
    const pacienteData = {
      ...data,
      dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : undefined
    };

    return prisma.paciente.update({
      where: { id },
      data: pacienteData
    });
  }

  // Desativar paciente
  static async desativarPaciente(id: number) {
    logDebug(`Desativando paciente ${id}`);
    return prisma.paciente.update({
      where: { id },
      data: { ativo: false }
    });
  }

  // Buscar pacientes por nome
  static async buscarPacientesPorNome(nome: string) {
    logDebug(`Buscando pacientes com nome: ${nome}`);
    return prisma.paciente.findMany({
      where: {
        AND: [
          { ativo: true },
          {
            nome: {
              contains: nome,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: { nome: 'asc' }
    });
  }
} 