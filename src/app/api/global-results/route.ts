import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";
    const animal = searchParams.get("animal") || "all";
    const blockchain = searchParams.get("blockchain") || "all";

    // Build query with filters
    let query = supabase
      .from("quiz_results")
      .select("memecoin_match, timestamp, animal_restriction, blockchain_restriction");

    // Apply time period filter
    if (period !== "all") {
      const days = parseInt(period);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      query = query.gte("timestamp", cutoffDate.toISOString());
    }

    // Apply animal filter
    if (animal !== "all") {
      query = query.eq("animal_restriction", animal);
    }

    // Apply blockchain filter
    if (blockchain !== "all") {
      query = query.eq("blockchain_restriction", blockchain);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: `Database query failed: ${error.message}` }, { status: 500 });
    }

    // Aggregate results
    const aggregated = (data || []).reduce((acc: { [key: string]: number }, item) => {
      const memecoin = item.memecoin_match;
      acc[memecoin] = (acc[memecoin] || 0) + 1;
      return acc;
    }, {});

    // Convert to array with percentages
    const total = Object.values(aggregated).reduce((sum: number, count) => sum + count, 0);
    const results = Object.entries(aggregated)
      .map(([memecoin_match, count]) => ({
        memecoin_match,
        count: count as number,
        percentage: total > 0 ? ((count as number / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    return NextResponse.json({ 
      results,
      total,
      period,
      filters: { animal, blockchain }
    });

  } catch (error) {
    console.error("Global results API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}