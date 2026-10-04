-- =============================================================================
-- Ronit Pharmacy – Sessions RLS & Realtime Configuration
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- 1. Enable RLS on sessions table
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Clean up any conflicting policy names
DROP POLICY IF EXISTS "anon_insert_sessions"    ON public.sessions;
DROP POLICY IF EXISTS "auth_select_sessions"    ON public.sessions;
DROP POLICY IF EXISTS "anon_can_insert_sessions" ON public.sessions;
DROP POLICY IF EXISTS "anon_can_read_sessions"   ON public.sessions;
DROP POLICY IF EXISTS "sessions_anon_insert"    ON public.sessions;
DROP POLICY IF EXISTS "sessions_admin_read"     ON public.sessions;
DROP POLICY IF EXISTS "admin_full_access_sessions" ON public.sessions;
DROP POLICY IF EXISTS "authenticated_full_sessions" ON public.sessions;

-- Anon (kiosk) can INSERT new completed sessions
CREATE POLICY "anon_insert_sessions"
  ON public.sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon (kiosk) can SELECT sessions (needed for lookup/returning rows)
CREATE POLICY "anon_select_sessions"
  ON public.sessions
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated (admins) have full access to all sessions across all devices
CREATE POLICY "admin_all_sessions"
  ON public.sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. session_concerns junction table
ALTER TABLE public.session_concerns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_session_concerns"  ON public.session_concerns;
DROP POLICY IF EXISTS "anon_select_session_concerns"  ON public.session_concerns;
DROP POLICY IF EXISTS "admin_all_session_concerns"    ON public.session_concerns;

CREATE POLICY "anon_insert_session_concerns"
  ON public.session_concerns
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_session_concerns"
  ON public.session_concerns
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_session_concerns"
  ON public.session_concerns
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. session_products junction table
ALTER TABLE public.session_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_session_products"  ON public.session_products;
DROP POLICY IF EXISTS "anon_select_session_products"  ON public.session_products;
DROP POLICY IF EXISTS "admin_all_session_products"    ON public.session_products;

CREATE POLICY "anon_insert_session_products"
  ON public.session_products
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_select_session_products"
  ON public.session_products
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "admin_all_session_products"
  ON public.session_products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Enable Supabase Realtime publication for sessions
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'sessions is already in supabase_realtime';
  END;
END
$$;
