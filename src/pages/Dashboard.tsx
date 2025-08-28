import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaChartLine, FaFilter } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

      // Use the new secure analytics function that returns aggregated data
      const periodDays = timePeriod !== "all" ? parseInt(timePeriod) : null;
      const animalFilterValue = animalFilter !== "all" ? animalFilter : null;
      const blockchainFilterValue = blockchainFilter !== "all" ? blockchainFilter : null;

      const { data, error } = await supabase.rpc('get_quiz_analytics', {
        period_days: periodDays,
        animal_filter: animalFilterValue,
        blockchain_filter: blockchainFilterValue
      });

      if (error) {
        throw error;
      }

      // The function already returns aggregated results with percentages
      setResults(data || []);
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
          'hsl(270, 95%, 75%)',
          'hsl(142, 69%, 58%)',
          'hsl(45, 96%, 64%)',
          'hsl(217, 91%, 70%)',
          'hsl(320, 86%, 78%)',
          'hsl(25, 95%, 63%)',
          'hsl(187, 85%, 70%)',
          'hsl(270, 50%, 65%)',
          'hsl(142, 50%, 45%)',
          'hsl(45, 80%, 55%)',
        ],
        borderColor: 'hsl(var(--border))',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: results.map(r => r.memecoin_match),
    datasets: [
      {
        data: results.map(r => r.percentage),
        backgroundColor: [
          'hsl(270, 95%, 75%)',
          'hsl(142, 69%, 58%)',
          'hsl(45, 96%, 64%)',
          'hsl(217, 91%, 70%)',
          'hsl(320, 86%, 78%)',
          'hsl(25, 95%, 63%)',
          'hsl(187, 85%, 70%)',
          'hsl(270, 50%, 65%)',
          'hsl(142, 50%, 45%)',
          'hsl(45, 80%, 55%)',
        ],
        borderColor: 'hsl(var(--background))',
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            size: 12,
            family: 'system-ui',
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Global Quiz Results Distribution',
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          maxRotation: 45,
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Percentage Distribution',
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <Card className="card-quiz max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="loading-spinner w-12 h-12 mx-auto"></div>
            <h3 className="text-xl font-semibold">Loading Dashboard</h3>
            <p className="text-muted-foreground">Fetching global quiz results...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <Card className="card-quiz max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-destructive">Error Loading Data</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchResults} className="btn-memecoin">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold memecoin-gradient bg-clip-text text-transparent">
            Global Analytics Dashboard
          </h1>
          <p className="text-xl text-foreground/90 font-medium">
            Real-time insights from memecoin quiz results worldwide
          </p>
          
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <FaHome className="w-4 h-4" />
                Back to Quiz
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-quiz text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {results.reduce((sum, r) => sum + r.count, 0)}
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-foreground/70 mt-1">
                <FaUsers className="w-3 h-3" />
                Quiz participants
              </div>
            </CardContent>
          </Card>

          <Card className="card-quiz text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Top Memecoin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {results[0]?.memecoin_match || "N/A"}
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-foreground/70 mt-1">
                <FaChartLine className="w-3 h-3" />
                {results[0]?.percentage.toFixed(1) || 0}% of all results
              </div>
            </CardContent>
          </Card>

          <Card className="card-quiz text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Active Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-memecoin-blue">
                {[timePeriod !== "all" ? "1" : "0", animalFilter !== "all" ? "1" : "0", blockchainFilter !== "all" ? "1" : "0"].filter(f => f === "1").length}
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-foreground/70 mt-1">
                <FaFilter className="w-3 h-3" />
                Applied filters
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-quiz">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaFilter className="w-5 h-5" />
              Filter Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </CardContent>
        </Card>

        {results.length > 0 ? (
          <div className="space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="card-quiz">
                <CardHeader>
                  <CardTitle>Distribution Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-quiz">
                <CardHeader>
                  <CardTitle>Percentage Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Results Grid */}
            <Card className="card-quiz">
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((result, index) => (
                    <Card key={result.memecoin_match} className="bg-card/80 border-border hover:border-primary/50 transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-semibold text-foreground mb-2">
                          {result.memecoin_match}
                        </div>
                        <div className="text-3xl font-bold text-primary mb-1">
                          {result.count}
                        </div>
                        <div className="text-sm text-foreground/80 font-medium">
                          {result.percentage.toFixed(1)}% of total
                        </div>
                        <div className="mt-3 w-full bg-muted/30 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-primary via-accent to-memecoin-blue h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${result.percentage}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="card-quiz">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No quiz results found for the selected filters. Try adjusting your filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}