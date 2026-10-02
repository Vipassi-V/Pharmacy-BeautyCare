-- ============================================================
-- Ronit Pharmacy & Beauty Care — Supabase RLS & Sessions Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Ensure the sessions table exists
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    surname TEXT,
    selected_skin_type TEXT,
    is_severe_flagged BOOLEAN DEFAULT false,
    recommendation_snapshot JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ensure session junction tables exist
CREATE TABLE IF NOT EXISTS public.session_concerns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    skin_problem_id UUID,
    skin_problem_name TEXT,
    is_severe BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    product_id UUID,
    product_name TEXT,
    brand TEXT,
    category_name TEXT,
    price NUMERIC DEFAULT 0,
    instruction TEXT,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_products ENABLE ROW LEVEL SECURITY;

-- 4. Drop any conflicting existing policies
DROP POLICY IF EXISTS "anon_can_insert_sessions" ON public.sessions;
DROP POLICY IF EXISTS "anon_can_read_sessions" ON public.sessions;
DROP POLICY IF EXISTS "authenticated_full_sessions" ON public.sessions;
DROP POLICY IF EXISTS "anon_can_insert_session_concerns" ON public.session_concerns;
DROP POLICY IF EXISTS "anon_can_read_session_concerns" ON public.session_concerns;
DROP POLICY IF EXISTS "authenticated_full_session_concerns" ON public.session_concerns;
DROP POLICY IF EXISTS "anon_can_insert_session_products" ON public.session_products;
DROP POLICY IF EXISTS "anon_can_read_session_products" ON public.session_products;
DROP POLICY IF EXISTS "authenticated_full_session_products" ON public.session_products;

-- 5. Policies for public.sessions
-- Allows the tablet kiosk (anonymous unauthenticated users) to save consultation records
CREATE POLICY "anon_can_insert_sessions" ON public.sessions
    FOR INSERT TO anon WITH CHECK (true);

-- Allows public / kiosk / admin to read sessions for history and reports
CREATE POLICY "anon_can_read_sessions" ON public.sessions
    FOR SELECT TO anon USING (true);

CREATE POLICY "authenticated_full_sessions" ON public.sessions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Policies for public.session_concerns
CREATE POLICY "anon_can_insert_session_concerns" ON public.session_concerns
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_can_read_session_concerns" ON public.session_concerns
    FOR SELECT TO anon USING (true);

CREATE POLICY "authenticated_full_session_concerns" ON public.session_concerns
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Policies for public.session_products
CREATE POLICY "anon_can_insert_session_products" ON public.session_products
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_can_read_session_products" ON public.session_products
    FOR SELECT TO anon USING (true);

CREATE POLICY "authenticated_full_session_products" ON public.session_products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Done! The tablet kiosk can now write completed sessions to Supabase
-- and the Pharmacist Admin Panel can view full consultation reports.
-- ============================================================
