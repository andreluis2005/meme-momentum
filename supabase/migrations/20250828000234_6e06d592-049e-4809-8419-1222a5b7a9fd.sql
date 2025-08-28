-- Update RLS policies to allow public read access for analytics
DROP POLICY IF EXISTS "Public can view aggregated quiz results" ON public.quiz_results;

-- Create a new policy that allows everyone to read quiz results for analytics
CREATE POLICY "Anyone can view quiz results for analytics" 
ON public.quiz_results 
FOR SELECT 
USING (true);

-- Keep the existing insert policy for users to save their own results
-- The "Users can insert their own quiz results" policy already exists and is correct