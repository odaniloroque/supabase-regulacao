-- Criação da tabela paciente
CREATE TABLE IF NOT EXISTS public.paciente (
    id SERIAL PRIMARY KEY,
    cartao_sus VARCHAR(15) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    nome_mae VARCHAR(255) NOT NULL,
    nome_pai VARCHAR(255),
    
    -- Campos de log
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    
    -- Constraints
    CONSTRAINT paciente_cartao_sus_check CHECK (cartao_sus ~ '^\d{15}$'),
    CONSTRAINT paciente_cpf_check CHECK (cpf ~ '^\d{11}$')
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_paciente_cartao_sus ON public.paciente(cartao_sus);
CREATE INDEX IF NOT EXISTS idx_paciente_cpf ON public.paciente(cpf);
CREATE INDEX IF NOT EXISTS idx_paciente_nome ON public.paciente(nome);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.paciente ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura pública de pacientes ativos"
    ON public.paciente
    FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Permitir inserção por usuários autenticados"
    ON public.paciente
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir atualização por usuários autenticados"
    ON public.paciente
    FOR UPDATE
    TO authenticated
    USING (is_active = true)
    WITH CHECK (is_active = true);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_paciente_updated_at
    BEFORE UPDATE ON public.paciente
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 