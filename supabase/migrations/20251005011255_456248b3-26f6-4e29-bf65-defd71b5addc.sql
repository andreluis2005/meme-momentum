-- Remove public read access to quiz results to prevent wallet address scraping
-- The get_quiz_analytics() function with SECURITY DEFINER will continue to provide
-- aggregated analytics data without exposing individual wallet addresses

DROP POLICY IF EXISTS "Anyone can view quiz results for analytics" ON public.quiz_results;