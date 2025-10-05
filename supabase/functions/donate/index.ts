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

    const body = await req.json();
    const { donationAmount } = body;
    
    // Enhanced input validation
    if (!donationAmount) {
      console.warn('Missing donation amount');
      return new Response(
        JSON.stringify({ error: 'Donation amount is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate amount is a valid number
    const amount = parseFloat(donationAmount);
    if (isNaN(amount)) {
      console.warn('Invalid donation amount format:', donationAmount);
      return new Response(
        JSON.stringify({ error: 'Invalid donation amount format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Security: Enforce minimum and maximum donation limits
    const MIN_DONATION = 0.0001; // Minimum 0.0001 ETH to prevent spam
    const MAX_DONATION = 100;     // Maximum 100 ETH to prevent errors/abuse
    
    if (amount < MIN_DONATION) {
      console.warn('Donation amount too small:', amount);
      return new Response(
        JSON.stringify({ error: `Minimum donation is ${MIN_DONATION} ETH` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (amount > MAX_DONATION) {
      console.warn('Donation amount too large:', amount);
      return new Response(
        JSON.stringify({ error: `Maximum donation is ${MAX_DONATION} ETH` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get developer wallet address from environment variable
    const developerAddress = Deno.env.get('DEVELOPER_WALLET_ADDRESS') || "0xdb5752b438b0bbfe0741b186e6e370f99b18387b";
    
    // Convert ETH to Wei (1 ETH = 10^18 Wei) with precision handling
    const amountInWei = (amount * Math.pow(10, 18)).toString();

    console.log(`Processing donation: ${amount} ETH (${amountInWei} Wei) to ${developerAddress}`);

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