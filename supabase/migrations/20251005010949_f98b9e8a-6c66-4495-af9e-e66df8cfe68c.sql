-- Remove public read access to user wallet addresses
-- This prevents anyone from scraping all wallet addresses from the database
-- The application only needs INSERT access to register wallets, not SELECT

DROP POLICY IF EXISTS "Anyone can view user data" ON public.users;