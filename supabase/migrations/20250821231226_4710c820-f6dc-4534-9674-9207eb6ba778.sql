-- Criar tabela para monitoramento de visitas
CREATE TABLE public.visitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sessao_id TEXT NOT NULL,
  pagina TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  tempo_permanencia INTEGER DEFAULT 0, -- em segundos
  data_entrada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_saida TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para eventos de cliques
CREATE TABLE public.eventos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sessao_id TEXT NOT NULL,
  pagina TEXT NOT NULL,
  elemento TEXT NOT NULL, -- tipo do elemento clicado
  elemento_id TEXT, -- id ou classe do elemento
  posicao_x INTEGER,
  posicao_y INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para leads/newsletter
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nome TEXT,
  origem TEXT DEFAULT 'newsletter', -- newsletter, contato, etc
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para métricas agregadas (para performance)
CREATE TABLE public.metricas_diarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL UNIQUE,
  total_visitas INTEGER DEFAULT 0,
  total_visitantes_unicos INTEGER DEFAULT 0,
  total_eventos INTEGER DEFAULT 0,
  pagina_mais_acessada TEXT,
  tempo_medio_permanencia INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_diarias ENABLE ROW LEVEL SECURITY;

-- Políticas para visitas (apenas admin pode ver)
CREATE POLICY "Admin pode visualizar todas as visitas" 
ON public.visitas 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM auth.users WHERE email = 'admin@victorsouza.dev'
));

CREATE POLICY "Permitir inserção de visitas anônimas" 
ON public.visitas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização de visitas anônimas" 
ON public.visitas 
FOR UPDATE 
USING (true);

-- Políticas para eventos (apenas admin pode ver)
CREATE POLICY "Admin pode visualizar todos os eventos" 
ON public.eventos 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM auth.users WHERE email = 'admin@victorsouza.dev'
));

CREATE POLICY "Permitir inserção de eventos anônimos" 
ON public.eventos 
FOR INSERT 
WITH CHECK (true);

-- Políticas para leads
CREATE POLICY "Admin pode visualizar todos os leads" 
ON public.leads 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM auth.users WHERE email = 'admin@victorsouza.dev'
));

CREATE POLICY "Permitir inserção de leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin pode gerenciar leads" 
ON public.leads 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM auth.users WHERE email = 'admin@victorsouza.dev'
));

-- Políticas para métricas diárias
CREATE POLICY "Admin pode visualizar métricas" 
ON public.metricas_diarias 
FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM auth.users WHERE email = 'admin@victorsouza.dev'
));

-- Função para calcular métricas diárias
CREATE OR REPLACE FUNCTION public.calcular_metricas_diarias(data_alvo DATE DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.metricas_diarias (
    data,
    total_visitas,
    total_visitantes_unicos,
    total_eventos,
    pagina_mais_acessada,
    tempo_medio_permanencia
  )
  SELECT 
    data_alvo,
    COUNT(*) as total_visitas,
    COUNT(DISTINCT sessao_id) as total_visitantes_unicos,
    (SELECT COUNT(*) FROM public.eventos WHERE DATE(timestamp) = data_alvo) as total_eventos,
    (SELECT pagina FROM public.visitas WHERE DATE(data_entrada) = data_alvo GROUP BY pagina ORDER BY COUNT(*) DESC LIMIT 1) as pagina_mais_acessada,
    COALESCE(AVG(tempo_permanencia), 0)::INTEGER as tempo_medio_permanencia
  FROM public.visitas 
  WHERE DATE(data_entrada) = data_alvo
  ON CONFLICT (data) 
  DO UPDATE SET
    total_visitas = EXCLUDED.total_visitas,
    total_visitantes_unicos = EXCLUDED.total_visitantes_unicos,
    total_eventos = EXCLUDED.total_eventos,
    pagina_mais_acessada = EXCLUDED.pagina_mais_acessada,
    tempo_medio_permanencia = EXCLUDED.tempo_medio_permanencia;
END;
$$;

-- Criar índices para performance
CREATE INDEX idx_visitas_sessao_id ON public.visitas(sessao_id);
CREATE INDEX idx_visitas_pagina ON public.visitas(pagina);
CREATE INDEX idx_visitas_data_entrada ON public.visitas(data_entrada);
CREATE INDEX idx_eventos_sessao_id ON public.eventos(sessao_id);
CREATE INDEX idx_eventos_elemento ON public.eventos(elemento);
CREATE INDEX idx_eventos_timestamp ON public.eventos(timestamp);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_metricas_data ON public.metricas_diarias(data);