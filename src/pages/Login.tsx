"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import WalletConnection from "@/components/WalletConnection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRocket, FaCoins, FaChartBar } from "react-icons/fa";

export default function LoginPage() {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/");
    }
  }, [address, router]);

  const handleConnect = (walletAddress: `0x${string}`) => {
    console.log("Wallet connected:", walletAddress);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 memecoin-gradient bg-clip-text text-transparent">
            Which Memecoin Are You?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover your memecoin personality through our interactive quiz. 
            Connect your wallet to save results and join the global leaderboard!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <FaCoins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personalized Quiz</h3>
                  <p className="text-muted-foreground">Answer questions to find your perfect memecoin match from 14+ popular coins</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <FaChartBar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Global Analytics</h3>
                  <p className="text-muted-foreground">See real-time results from the community and compare your match</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <FaRocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Web3 Integration</h3>
                  <p className="text-muted-foreground">Built on Base blockchain with wallet integration and donation features</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <WalletConnection onConnect={handleConnect} showCard={true} />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a href="https://base.org" className="text-accent hover:underline">Base</a>{" "}
            and{" "}
            <a href="https://supabase.com" className="text-accent hover:underline">Supabase</a>
          </p>
        </div>
      </div>
    </div>
  );
}