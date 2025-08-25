import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
  let query = supabase
    .from('quiz_results')
    .select('memecoin_match, timestamp, animal_restriction, blockchain_restriction');

  // Apply filters
  if (filters.period && filters.period !== 'all') {
    const days = parseInt(filters.period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    query = query.gte('timestamp', cutoffDate.toISOString());
  }

  if (filters.animal && filters.animal !== 'all') {
    query = query.eq('animal_restriction', filters.animal);
  }

  if (filters.blockchain && filters.blockchain !== 'all') {
    query = query.eq('blockchain_restriction', filters.blockchain);
  }

  return await query;
}