-- 1. Intentar activar Políticas de Seguridad (RLS) por si faltaban
-- (Si ya existen, esto fallará pero no pasa nada)
create policy "Users can view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );
create policy "Users can insert own profile" on public.profiles for insert with check ( auth.uid() = id );

-- 2. IMPORTANTE: Vamos a BORRAR el trigger temporalmente.
-- Si el error desaparece al hacer esto, confirmaremos que el problema está en la tabla 'profiles'.
drop trigger if exists on_auth_user_created on auth.users;
