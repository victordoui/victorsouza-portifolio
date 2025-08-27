-- Add image_url and ordem_exibicao fields to artigos table
ALTER TABLE public.artigos 
ADD COLUMN imagem_url TEXT,
ADD COLUMN ordem_exibicao INTEGER DEFAULT 0;

-- Add ordem_exibicao field to projetos table
ALTER TABLE public.projetos 
ADD COLUMN ordem_exibicao INTEGER DEFAULT 0;

-- Create index for better performance on ordering
CREATE INDEX idx_projetos_ordem_exibicao ON public.projetos(ordem_exibicao DESC);
CREATE INDEX idx_artigos_ordem_exibicao ON public.artigos(ordem_exibicao DESC);