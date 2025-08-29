-- Drop existing RLS policies that expect JWT authentication
DROP POLICY IF EXISTS "Users can insert their own quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Users can view their own quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;

-- Create new policies that work with wallet-based authentication
-- For quiz_results table
CREATE POLICY "Anyone can insert quiz results" 
ON quiz_results 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view quiz results for analytics" 
ON quiz_results 
FOR SELECT 
USING (true);

-- For users table
CREATE POLICY "Anyone can insert user data" 
ON users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view user data" 
ON users 
FOR SELECT 
USING (true);