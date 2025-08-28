import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kifazfavgxpanbdkmtaj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZmF6ZmF2Z3hwYW5iZGttdGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODQ4NzYsImV4cCI6MjA3MTU2MDg3Nn0.wv-Y6QQoMEeZBTDbrnDrTACHRp4i77BO4hjEXry7-jM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface User {
  wallet_address: string;
  created_at: string;
}

export interface QuizResult {
  id?: number;
  user_address: string;
  memecoin_match: string;
  scores: Record<string, number>;
  timestamp: string;
  animal_restriction?: string;
  blockchain_restriction?: string;
}

export interface Donation {
  id?: number;
  user_address: string;
  amount: number;
  currency: string;
  to_address: string;
  cause: string;
  dev_donation: number;
  tx_hash: string;
  created_at: string;
}

// Helper functions
export async function createUser(walletAddress: string) {
  return await supabase
    .from('users')
    .upsert({ 
      wallet_address: walletAddress,
      created_at: new Date().toISOString()
    }, { 
      onConflict: 'wallet_address',
      ignoreDuplicates: true 
    });
}

export async function saveQuizResult(result: Omit<QuizResult, 'id'>) {
  return await supabase
    .from('quiz_results')
    .insert(result);
}

export async function getGlobalResults(filters: {
  period?: string;
  animal?: string;
  blockchain?: string;
} = {}) {
  // Use the new secure analytics function that doesn't expose user data
  const periodDays = filters.period && filters.period !== 'all' ? parseInt(filters.period) : null;
  const animalFilter = filters.animal && filters.animal !== 'all' ? filters.animal : null;
  const blockchainFilter = filters.blockchain && filters.blockchain !== 'all' ? filters.blockchain : null;

  return await supabase.rpc('get_quiz_analytics', {
    period_days: periodDays,
    animal_filter: animalFilter,
    blockchain_filter: blockchainFilter
  });
}