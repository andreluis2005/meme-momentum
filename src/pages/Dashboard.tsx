import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface QuizResult {
  memecoin_match: string;
  count: number;
  percentage: number;
}

interface GlobalResultsResponse {
  results: QuizResult[];
  total: number;
  period: string;
  filters: {
    animal: string;
    blockchain: string;
  };
}

export default function Dashboard() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("all");
  const [animalFilter, setAnimalFilter] = useState("all");
  const [blockchainFilter, setBlockchainFilter] = useState("all");

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from Supabase directly instead of API route
      let query = supabase
        .from("quiz_results")
        .select("memecoin_match, timestamp, animal_restriction, blockchain_restriction");

      // Apply time period filter
      if (timePeriod !== "all") {
        const days = parseInt(timePeriod);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        query = query.gte("timestamp", cutoffDate.toISOString());
      }

      // Apply animal filter
      if (animalFilter !== "all") {
        query = query.eq("animal_restriction", animalFilter);
      }

      // Apply blockchain filter
      if (blockchainFilter !== "all") {
        query = query.eq("blockchain_restriction", blockchainFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Aggregate results
      const aggregated = (data || []).reduce((acc: { [key: string]: number }, item) => {
        const memecoin = item.memecoin_match;
        acc[memecoin] = (acc[memecoin] || 0) + 1;
        return acc;
      }, {});

      // Convert to array with percentages
      const total = Object.values(aggregated).reduce((sum: number, count) => sum + count, 0);
      const processedResults = Object.entries(aggregated)
        .map(([memecoin_match, count]) => ({
          memecoin_match,
          count: count as number,
          percentage: total > 0 ? ((count as number / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      setResults(processedResults);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [timePeriod, animalFilter, blockchainFilter]);

  const chartData = {
    labels: results.map(r => r.memecoin_match),
    datasets: [
      {
        label: 'Quiz Results',
        data: results.map(r => r.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Global Quiz Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading dashboard...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">Error: {error}</div>
            <Button onClick={fetchResults} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Quiz Results Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1">Last 24 Hours</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={animalFilter} onValueChange={setAnimalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Animal Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Animals</SelectItem>
                <SelectItem value="dogs">Dogs</SelectItem>
                <SelectItem value="cats">Cats</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={blockchainFilter} onValueChange={setBlockchainFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Blockchain Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blockchains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {results.length > 0 ? (
            <div className="space-y-6">
              <div className="h-96">
                <Bar data={chartData} options={chartOptions} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, index) => (
                  <Card key={result.memecoin_match}>
                    <CardContent className="p-4">
                      <div className="text-lg font-semibold">{result.memecoin_match}</div>
                      <div className="text-2xl font-bold text-primary">
                        {result.count}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.percentage.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No quiz results found for the selected filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}