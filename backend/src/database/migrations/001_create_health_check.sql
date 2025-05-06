-- Criação da tabela health_check
CREATE TABLE IF NOT EXISTS public.health_check (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'ok',
    last_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir um registro inicial
INSERT INTO public.health_check (status) VALUES ('ok');

-- Configurar RLS (Row Level Security)
ALTER TABLE public.health_check ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura pública
CREATE POLICY "Permitir leitura pública da tabela health_check"
    ON public.health_check
    FOR SELECT
    TO public
    USING (true); 