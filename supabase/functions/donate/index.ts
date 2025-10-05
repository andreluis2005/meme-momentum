import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { donationAmount } = await req.json();
    
    if (!donationAmount || isNaN(parseFloat(donationAmount))) {
      return new Response(
        JSON.stringify({ error: 'Invalid donation amount' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get developer wallet address from environment variable
    const developerAddress = Deno.env.get('DEVELOPER_WALLET_ADDRESS') || "0xdb5752b438b0bbfe0741b186e6e370f99b18387b";
    
    // Convert ETH to Wei (1 ETH = 10^18 Wei)
    const amount = parseFloat(donationAmount);
    const amountInWei = (amount * Math.pow(10, 18)).toString();

    return new Response(
      JSON.stringify({ 
        toAddress: developerAddress,
        amountInWei: amountInWei,
        success: true 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Donation processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process donation' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});