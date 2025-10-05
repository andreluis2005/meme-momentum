"use client";

import { useState } from "react";
import { useSendTransaction, useAccount, usePublicClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FaHeart, FaEthereum } from "react-icons/fa";

interface DonationFormProps {
  userAddress: string;
}

export default function DonationForm({ userAddress }: DonationFormProps) {
  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendTransactionAsync } = useSendTransaction();
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();

  const handleDonation = async () => {
    // Enhanced client-side validation
    if (!isConnected) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your wallet before donating.",
        variant: "destructive",
      });
      return;
    }

    if (!userAddress || !donationAmount) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    // Validate amount
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive number.",
        variant: "destructive",
      });
      return;
    }

    // Enforce min/max limits (matching edge function)
    const MIN_DONATION = 0.0001;
    const MAX_DONATION = 100;

    if (amount < MIN_DONATION) {
      toast({
        title: "Amount Too Small",
        description: `Minimum donation is ${MIN_DONATION} ETH.`,
        variant: "destructive",
      });
      return;
    }

    if (amount > MAX_DONATION) {
      toast({
        title: "Amount Too Large",
        description: `Maximum donation is ${MAX_DONATION} ETH.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {

      const response = await fetch("https://kifazfavgxpanbdkmtaj.supabase.co/functions/v1/donate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZmF6ZmF2Z3hwYW5iZGttdGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODQ4NzYsImV4cCI6MjA3MTU2MDg3Nn0.wv-Y6QQoMEeZBTDbrnDrTACHRp4i77BO4hjEXry7-jM`
        },
        body: JSON.stringify({
          donationAmount: donationAmount
        }),
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Wait for user to confirm transaction in wallet
      const txHash = await sendTransactionAsync({
        to: result.toAddress as `0x${string}`,
        value: BigInt(result.amountInWei),
      });

      // Optionally wait for on-chain confirmation
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }

      toast({
        title: "Donation Sent! 🎉",
        description: `Thank you for donating ${donationAmount} ETH!`,
      });

      setDonationAmount("");
    } catch (error) {
      console.error("Donation error:", error);
      toast({
        title: "Donation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-quiz w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FaHeart className="w-5 h-5 text-red-500" />
          Support the Developer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Help support the development of this memecoin quiz app!
        </p>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FaEthereum className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="0.001"
              step="0.0001"
              min="0.0001"
              max="100"
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleDonation}
            disabled={!donationAmount || isLoading}
            className="btn-memecoin"
          >
            {isLoading ? "Sending..." : "Donate"}
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {["0.001", "0.005", "0.01"].map((amount) => (
            <Button
              key={amount}
              onClick={() => setDonationAmount(amount)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {amount} ETH
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}