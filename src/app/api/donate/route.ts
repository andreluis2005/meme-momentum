import { NextResponse } from "next/server";
import { parseEther, isAddress } from "viem";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kifazfavgxpanbdkmtaj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZmF6ZmF2Z3hwYW5iZGttdGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODQ4NzYsImV4cCI6MjA3MTU2MDg3Nn0.wv-Y6QQoMEeZBTDbrnDrTACHRp4i77BO4hjEXry7-jM"
);

export async function POST(request: Request) {
  try {
    const { command, signerData, donateToDev, txHash } = await request.json();
    const developerAddress = "0xf2D3CeF68400248C9876f5A281291c7c4603D100";
    
    const match = command.match(/donate\s+(\d+\.?\d*)\s+ETH\s+to\s+developer/i);
    if (!match) {
      return NextResponse.json({ error: "Invalid command format." }, { status: 400 });
    }

    const [, amount] = match;
    const amountFloat = parseFloat(amount);

    if (!isAddress(signerData.address) || !isAddress(developerAddress)) {
      return NextResponse.json({ error: "Invalid address." }, { status: 400 });
    }

    if (isNaN(amountFloat) || amountFloat <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const amountInWei = parseEther(amount).toString();

    // Save donation to database
    const { error } = await supabase.from("donations").insert({
      user_address: signerData.address,
      amount: amountFloat,
      currency: "ETH",
      to_address: developerAddress,
      cause: "developer",
      dev_donation: donateToDev ? amountFloat : 0,
      tx_hash: txHash,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Database save error:", error);
      return NextResponse.json(
        { error: `Failed to save donation: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      toAddress: developerAddress,
      amountInWei,
      currency: "ETH",
    }, { status: 200 });

  } catch (error) {
    console.error("Donation API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}