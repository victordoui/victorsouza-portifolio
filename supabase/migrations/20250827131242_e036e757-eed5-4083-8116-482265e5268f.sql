-- 1) PROJETOS: adicionar colunas
ALTER TABLE public.projetos
  ADD COLUMN IF NOT EXISTS title_align text NOT NULL DEFAULT 'left',
  ADD COLUMN IF NOT EXISTS description_align text NOT NULL DEFAULT 'left',
  ADD COLUMN IF NOT EXISTS image_fit text NOT NULL DEFAULT 'cover',
  ADD COLUMN IF NOT EXISTS image_focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS image_focal_y smallint NOT NULL DEFAULT 50;

-- Constraints para valores válidos (projetos)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projetos_title_align_chk'
  ) THEN
    ALTER TABLE public.projetos
      ADD CONSTRAINT projetos_title_align_chk
      CHECK (title_align IN ('left','center','right','justify'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projetos_description_align_chk'
  ) THEN
    ALTER TABLE public.projetos
      ADD CONSTRAINT projetos_description_align_chk
      CHECK (description_align IN ('left','center','right','justify'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projetos_image_fit_chk'
  ) THEN
    ALTER TABLE public.projetos
      ADD CONSTRAINT projetos_image_fit_chk
      CHECK (image_fit IN ('cover','contain'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projetos_image_focal_x_chk'
  ) THEN
    ALTER TABLE public.projetos
      ADD CONSTRAINT projetos_image_focal_x_chk
      CHECK (image_focal_x >= 0 AND image_focal_x <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projetos_image_focal_y_chk'
  ) THEN
    ALTER TABLE public.projetos
      ADD CONSTRAINT projetos_image_focal_y_chk
      CHECK (image_focal_y >= 0 AND image_focal_y <= 100);
  END IF;
END$$;

-- 2) ARTIGOS: adicionar colunas
ALTER TABLE public.artigos
  ADD COLUMN IF NOT EXISTS title_align text NOT NULL DEFAULT 'left',
  ADD COLUMN IF NOT EXISTS resumo_align text NOT NULL DEFAULT 'left',
  ADD COLUMN IF NOT EXISTS conteudo_align text NOT NULL DEFAULT 'left',
  ADD COLUMN IF NOT EXISTS image_fit text NOT NULL DEFAULT 'cover',
  ADD COLUMN IF NOT EXISTS image_focal_x smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS image_focal_y smallint NOT NULL DEFAULT 50;

-- Constraints para valores válidos (artigos)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'artigos_title_align_chk'
  ) THEN
    ALTER TABLE public.artigos
      ADD CONSTRAINT artigos_title_align_chk
      CHECK (title_align IN ('left','center','right','justify'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'artigos_resumo_align_chk'
  ) THEN
    ALTER TABLE public.artigos
      ADD CONSTRAINT artigos_resumo_align_chk
      CHECK (resumo_align IN ('left','center','right','justify'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'artigos_conteudo_align_chk'
  ) THEN
    ALTER TABLE public.artigos
      ADD CONSTRAINT artigos_conteudo_align_chk
      CHECK (conteudo_align IN ('left','center','right','justify'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'artigos_image_fit_chk'
  ) THEN
    ALTER TABLE public.artigos
      ADD CONSTRAINT artigos_image_fit_chk
      CHECK (image_fit IN ('cover','contain'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'artigos_image_focal_x_chk'
  ) THEN
    ALTER TABLE public.artigos
      ADD CONSTRAINT artigos_image_focal_x_chk
      CHECK (image_focal_x >= 0 AND image_focal_x <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'artigos_image_focal_y_chk'
  ) THEN
    ALTER TABLE public.artigos
      ADD CONSTRAINT artigos_image_focal_y_chk
      CHECK (image_focal_y >= 0 AND image_focal_y <= 100);
  END IF;
END$$;