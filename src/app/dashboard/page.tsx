"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { FaChartBar, FaRocket, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GlobalResult {
  memecoin_match: string;
  count: number;
  percentage: number;
}

export default function DashboardPage() {
  const [results, setResults] = useState<GlobalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("all");
  const [animalFilter, setAnimalFilter] = useState("all");
  const [blockchainFilter, setBlockchainFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        period: timePeriod,
        animal: animalFilter,
        blockchain: blockchainFilter,
      });

      const response = await fetch(`/api/global-results?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to fetch global results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [timePeriod, animalFilter, blockchainFilter]);

  // WebSocket for real-time updates
  useEffect(() => {
    let socket: any = null;
    
    const connectWebSocket = async () => {
      try {
        const io = await import('socket.io-client');
        socket = io.default('ws://localhost:3001');
        
        socket.on('connect', () => {
          console.log('Connected to WebSocket');
        });
        
        socket.on('quizResult', (data: any) => {
          console.log('New quiz result:', data);
          fetchResults(); // Refresh data when new result comes in
        });
        
        socket.on('disconnect', () => {
          console.log('Disconnected from WebSocket');
        });
      } catch (error) {
        console.warn('WebSocket connection failed:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const chartData = {
    labels: results.map(r => r.memecoin_match),
    datasets: [
      {
        label: 'Number of Users',
        data: results.map(r => r.count),
        backgroundColor: [
          'rgba(167, 139, 250, 0.8)', // purple
          'rgba(34, 211, 238, 0.8)',  // cyan
          'rgba(244, 114, 182, 0.8)', // pink
          'rgba(96, 165, 250, 0.8)',  // blue
          'rgba(251, 191, 36, 0.8)',  // yellow
          'rgba(52, 211, 153, 0.8)',  // emerald
          'rgba(248, 113, 113, 0.8)', // red
          'rgba(168, 85, 247, 0.8)',  // violet
          'rgba(45, 212, 191, 0.8)',  // teal
          'rgba(251, 146, 60, 0.8)',  // orange
        ],
        borderColor: [
          'rgba(167, 139, 250, 1)',
          'rgba(34, 211, 238, 1)',
          'rgba(244, 114, 182, 1)',
          'rgba(96, 165, 250, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(52, 211, 153, 1)',
          'rgba(248, 113, 113, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(45, 212, 191, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
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
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Global Memecoin Quiz Results',
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const result = results[context.dataIndex];
            return [
              `Count: ${result.count}`,
              `Percentage: ${result.percentage.toFixed(1)}%`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          stepSize: 1
        },
        grid: {
          color: 'hsl(var(--border))',
        }
      },
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          maxRotation: 45
        },
        grid: {
          color: 'hsl(var(--border))',
        }
      }
    }
  };

  const totalUsers = results.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="min-h-screen p-4 hero-gradient">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 memecoin-gradient bg-clip-text text-transparent">
            Global Memecoin Analytics
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Real-time insights into which memecoins resonate with our community
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button className="btn-memecoin">
                <FaRocket className="w-4 h-4 mr-2" />
                Take the Quiz
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="card-quiz">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Quiz Takers</div>
            </CardContent>
          </Card>
          
          <Card className="card-quiz">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">{results.length}</div>
              <div className="text-sm text-muted-foreground">Unique Memecoins</div>
            </CardContent>
          </Card>
          
          <Card className="card-quiz">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-memecoin-gold mb-2">
                {results.length > 0 ? results[0].memecoin_match : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Most Popular</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-quiz mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaFilter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Time Period</label>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Animal Theme</label>
                <Select value={animalFilter} onValueChange={setAnimalFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Frog">Frog</SelectItem>
                    <SelectItem value="Penguin">Penguin</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Blockchain</label>
                <Select value={blockchainFilter} onValueChange={setBlockchainFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blockchains</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Solana">Solana</SelectItem>
                    <SelectItem value="Base">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="card-quiz">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaChartBar className="w-5 h-5" />
              Community Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-lg">Loading analytics...</div>
              </div>
            ) : error ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
              </div>
            ) : results.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
              </div>
            ) : (
              <div className="h-96">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <Card className="card-quiz max-w-md mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Haven't taken the quiz yet?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of others and discover your memecoin personality!
              </p>
              <Link href="/">
                <Button className="btn-memecoin w-full">
                  Take the Quiz Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}