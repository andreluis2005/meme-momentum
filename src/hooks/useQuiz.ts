"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface QuizScores {
  [key: string]: number;
}

interface QuizResult {
  memecoin_match: string;
  scores: QuizScores;
  animal_restriction?: string;
  blockchain_restriction?: string;
}

export function useQuiz() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveQuizResult = useCallback(async (result: QuizResult) => {
    if (!address) {
      setError("Wallet not connected");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, ensure user exists
      const { error: userError } = await supabase
        .from("users")
        .upsert({ 
          wallet_address: address,
          created_at: new Date().toISOString()
        }, { 
          onConflict: 'wallet_address',
          ignoreDuplicates: true 
        });

      if (userError) {
        console.error("User upsert error:", userError);
      }

      // Save quiz result
      const { error: quizError } = await supabase
        .from("quiz_results")
        .insert({
          user_address: address,
          memecoin_match: result.memecoin_match,
          scores: result.scores,
          timestamp: new Date().toISOString(),
          animal_restriction: result.animal_restriction || null,
          blockchain_restriction: result.blockchain_restriction || null,
        });

      if (quizError) {
        throw new Error(`Failed to save quiz result: ${quizError.message}`);
      }

      // Emit WebSocket event for real-time updates
      if (typeof window !== 'undefined') {
        try {
          const io = await import('socket.io-client');
          const socket = io.default('ws://localhost:3001');
          socket.emit('quizResult', {
            memecoin_match: result.memecoin_match,
            timestamp: new Date().toISOString()
          });
          socket.disconnect();
        } catch (wsError) {
          console.warn("WebSocket emission failed:", wsError);
        }
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Quiz save error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const getTopMemecoin = useCallback((scores: QuizScores): string => {
    const entries = Object.entries(scores);
    const validEntries = entries.filter(([_, score]) => score > 0);
    
    if (validEntries.length === 0) {
      return "Dogecoin"; // Default fallback
    }

    return validEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }, []);

  return {
    saveQuizResult,
    getTopMemecoin,
    isLoading,
    error,
  };
}