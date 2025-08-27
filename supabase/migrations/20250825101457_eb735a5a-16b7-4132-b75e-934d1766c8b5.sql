-- 1) Criar/garantir bucket público para imagens de projetos
insert into storage.buckets (id, name, public)
values ('projeto-images', 'projeto-images', true)
on conflict (id) do update set
  name = excluded.name,
  public = true;

-- 2) Políticas de acesso no storage.objects para o bucket 'projeto-images'
-- SELECT: qualquer pessoa pode visualizar/listar objetos desse bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Anyone can view project images'
  ) then
    create policy "Anyone can view project images"
      on storage.objects
      for select
      using (bucket_id = 'projeto-images');
  end if;
end $$;

-- INSERT: apenas usuários autenticados podem subir arquivos nesse bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can upload project images'
  ) then
    create policy "Users can upload project images"
      on storage.objects
      for insert
      with check (bucket_id = 'projeto-images' and auth.uid() is not null);
  end if;
end $$;

-- UPDATE: somente o dono do arquivo pode atualizar
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can update their own project images'
  ) then
    create policy "Users can update their own project images"
      on storage.objects
      for update
      using (bucket_id = 'projeto-images' and owner = auth.uid());
  end if;
end $$;

-- DELETE: somente o dono do arquivo pode excluir
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can delete their own project images'
  ) then
    create policy "Users can delete their own project images"
      on storage.objects
      for delete
      using (bucket_id = 'projeto-images' and owner = auth.uid());
  end if;
end $$;