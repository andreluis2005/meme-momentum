-- Create users table
CREATE TABLE public.users (
  wallet_address TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table  
CREATE TABLE public.quiz_results (
  id BIGSERIAL PRIMARY KEY,
  user_address TEXT NOT NULL REFERENCES public.users(wallet_address),
  memecoin_match TEXT NOT NULL,
  scores JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  animal_restriction TEXT,
  blockchain_restriction TEXT
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own data" ON public.users  
  FOR INSERT WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create RLS policies for quiz_results table
CREATE POLICY "Users can view their own quiz results" ON public.quiz_results
  FOR SELECT USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own quiz results" ON public.quiz_results
  FOR INSERT WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Allow public read access to aggregated quiz results for dashboard
CREATE POLICY "Public can view aggregated quiz results" ON public.quiz_results
  FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX idx_quiz_results_memecoin ON public.quiz_results(memecoin_match);
CREATE INDEX idx_quiz_results_timestamp ON public.quiz_results(timestamp);
CREATE INDEX idx_quiz_results_animal ON public.quiz_results(animal_restriction);
CREATE INDEX idx_quiz_results_blockchain ON public.quiz_results(blockchain_restriction);