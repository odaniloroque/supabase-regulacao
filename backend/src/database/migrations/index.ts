import { supabaseAdmin } from '../../services/supabase';
import { config } from '../../config';
import fs from 'fs';
import path from 'path';

// Função auxiliar para logging
const logDebug = (message: string, data?: any) => {
  if (config.server.nodeEnv === 'development') {
    console.log(`[MIGRATIONS] ${message}`, data ? data : '');
  }
};

// Função para executar uma migração
async function executeMigration(sql: string, migrationName: string) {
  logDebug(`Executando migração: ${migrationName}`);
  
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
    
    if (error) {
      logDebug(`Erro na migração ${migrationName}:`, error);
      throw error;
    }
    
    logDebug(`Migração ${migrationName} executada com sucesso`);
  } catch (error) {
    logDebug(`Erro ao executar migração ${migrationName}:`, error);
    throw error;
  }
}

// Função para executar todas as migrações
export async function runMigrations() {
  logDebug('Iniciando execução das migrações');
  
  try {
    // Criar tabela de migrações se não existir
    const createMigrationsTable = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await executeMigration(createMigrationsTable, 'create_migrations_table');
    
    // Ler diretório de migrações
    const migrationsDir = path.join(__dirname, 'sql');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Executar cada migração
    for (const file of files) {
      const migrationName = path.basename(file, '.sql');
      
      // Verificar se a migração já foi executada
      const { data: existingMigration } = await supabaseAdmin
        .from('migrations')
        .select('id')
        .eq('name', migrationName)
        .single();
      
      if (!existingMigration) {
        // Ler e executar o arquivo SQL
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await executeMigration(sql, migrationName);
        
        // Registrar migração executada
        await supabaseAdmin
          .from('migrations')
          .insert({ name: migrationName });
      } else {
        logDebug(`Migração ${migrationName} já foi executada anteriormente`);
      }
    }
    
    logDebug('Todas as migrações foram executadas com sucesso');
  } catch (error) {
    logDebug('Erro ao executar migrações:', error);
    throw error;
  }
} 