-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.get_quiz_analytics(
  period_days INTEGER DEFAULT NULL,
  animal_filter TEXT DEFAULT NULL,
  blockchain_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  memecoin_match TEXT,
  count BIGINT,
  percentage NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_count BIGINT;
BEGIN
  -- Get total count for percentage calculation
  SELECT COUNT(*) INTO total_count
  FROM quiz_results
  WHERE 
    (period_days IS NULL OR timestamp >= (NOW() - INTERVAL '1 day' * period_days))
    AND (animal_filter IS NULL OR animal_filter = 'all' OR animal_restriction = animal_filter)
    AND (blockchain_filter IS NULL OR blockchain_filter = 'all' OR blockchain_restriction = blockchain_filter);

  -- Return aggregated results without exposing individual user data
  RETURN QUERY
  SELECT 
    qr.memecoin_match,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / GREATEST(total_count, 1)), 2) as percentage
  FROM quiz_results qr
  WHERE 
    (period_days IS NULL OR qr.timestamp >= (NOW() - INTERVAL '1 day' * period_days))
    AND (animal_filter IS NULL OR animal_filter = 'all' OR qr.animal_restriction = animal_filter)
    AND (blockchain_filter IS NULL OR blockchain_filter = 'all' OR qr.blockchain_restriction = blockchain_filter)
  GROUP BY qr.memecoin_match
  ORDER BY count DESC;
END;
$$;