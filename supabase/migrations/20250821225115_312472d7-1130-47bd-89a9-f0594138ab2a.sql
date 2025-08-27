-- Create projetos table
CREATE TABLE public.projetos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tecnologias TEXT[] DEFAULT '{}',
  imagem_url TEXT,
  link_demo TEXT,
  link_codigo TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create artigos table
CREATE TABLE public.artigos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artigos ENABLE ROW LEVEL SECURITY;

-- Create policies for projetos
CREATE POLICY "Anyone can view projetos" 
ON public.projetos 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert projetos" 
ON public.projetos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projetos" 
ON public.projetos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projetos" 
ON public.projetos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for artigos
CREATE POLICY "Anyone can view artigos" 
ON public.artigos 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert artigos" 
ON public.artigos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artigos" 
ON public.artigos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artigos" 
ON public.artigos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('projeto-images', 'projeto-images', true);

-- Create storage policies for projeto images
CREATE POLICY "Anyone can view projeto images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projeto-images');

CREATE POLICY "Authenticated users can upload projeto images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'projeto-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own projeto images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'projeto-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own projeto images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'projeto-images' AND auth.uid()::text = (storage.foldername(name))[1]);