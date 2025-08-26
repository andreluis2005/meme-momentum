import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

import WalletConnection from "@/components/WalletConnection";
import Quiz from "@/components/Quiz";
import Filters from "@/components/Filters";
import DonationForm from "@/components/DonationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz } from "@/hooks/useQuiz";
import { FaChartBar, FaGlobe, FaRocket } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Memecoin data
const memecoins: { [key: string]: { name: string; description: string; image: string } } = {
  Dogecoin: { name: "Dogecoin", description: "The ultimate OG memecoin, born from fun and still going strong.", image: "https://which-memecoin-are-you.vercel.app/dogecoin.png" },
  ShibaInu: { name: "Shiba Inu", description: "A passionate and energetic community, the so-called 'Dogecoin killer.'", image: "https://which-memecoin-are-you.vercel.app/shibainu.png" },
  Pepe: { name: "Pepe", description: "The most famous frog on the internet, pure meme culture.", image: "https://which-memecoin-are-you.vercel.app/pepe.png" },
  TrumpCoin: { name: "Trump Coin", description: "A political memecoin with strong presence in online debates.", image: "https://which-memecoin-are-you.vercel.app/trumpcoin.png" },
  Dogwifhat: { name: "dogwifhat", description: "A quirky dog-themed memecoin with a cult following.", image: "https://which-memecoin-are-you.vercel.app/dogwifhat.png" },
  MogCoin: { name: "Mog Coin", description: "A cat-themed memecoin for those who vibe with feline energy.", image: "https://which-memecoin-are-you.vercel.app/mogcoin.png" },
  Turbo: { name: "Turbo", description: "A high-energy memecoin for those who move fast.", image: "https://which-memecoin-are-you.vercel.app/turbo.png" },
  DOG: { name: "DOG", description: "A fresh take on dog-themed memecoins, full of loyalty.", image: "https://which-memecoin-are-you.vercel.app/dog.png" },
  Fartcoin: { name: "Fartcoin", description: "The most humorous memecoin, because why not?", image: "https://which-memecoin-are-you.vercel.app/fartcoin.png" },
  Pengu: { name: "Pengu", description: "Cute penguin vibes with strong community spirit.", image: "https://which-memecoin-are-you.vercel.app/pengu.png" },
  Bonk: { name: "Bonk", description: "Solana's favorite dog coin with explosive energy.", image: "https://which-memecoin-are-you.vercel.app/bonk.png" },
  SPX: { name: "SPX", description: "Market-focused memecoin for trading enthusiasts.", image: "https://which-memecoin-are-you.vercel.app/spx.png" },
  Toshi: { name: "Toshi", description: "Base's beloved cat memecoin with sophisticated charm.", image: "https://which-memecoin-are-you.vercel.app/toshi.png" },
  Brett: { name: "Brett", description: "The blue guy from the memes, pure internet culture.", image: "https://which-memecoin-are-you.vercel.app/brett.png" },
};

function spawnConfetti() {
  const root = document.getElementById("confetti-root");
  if (!root) return;
  
  const colors = ["#a78bfa", "#22d3ee", "#f472b6", "#60a5fa", "#fbbf24", "#34d399"];
  const count = 120;
  
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = `confetti-piece ${Math.random() > 0.5 ? "circle" : ""}`;
    const size = 6 + Math.random() * 8;
    const left = Math.random() * 100;
    const duration = 1.8 + Math.random() * 1.8;
    const delay = Math.random() * 0.3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotate = Math.random() * 360;
    
    piece.style.left = `${left}vw`;
    piece.style.background = color;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.2}px`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.transform = `rotate(${rotate}deg)`;
    
    root.appendChild(piece);
    
    setTimeout(() => {
      if (piece && piece.parentNode) {
        piece.parentNode.removeChild(piece);
      }
    }, (duration + delay) * 1000 + 100);
  }
}

const Index = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveQuizResult, getTopMemecoin, isLoading: quizLoading } = useQuiz();
  
  const [currentStep, setCurrentStep] = useState<"filters" | "quiz" | "result">("filters");
  const [animalRestriction, setAnimalRestriction] = useState<string | null>(null);
  const [blockchainRestriction, setBlockchainRestriction] = useState<string | null>(null);
  const [quizScores, setQuizScores] = useState<{ [key: string]: number }>({});
  const [finalResult, setFinalResult] = useState<string>("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!address) {
      navigate("/login");
    }
  }, [address, navigate]);

  // Don't render anything while checking auth
  if (!address) {
    return null;
  }

  const handleFiltersComplete = () => {
    setCurrentStep("quiz");
  };

  const handleQuizComplete = async (scores: { [key: string]: number }) => {
    setQuizScores(scores);
    const topMemecoin = getTopMemecoin(scores);
    setFinalResult(topMemecoin);

    // Save to database
    const success = await saveQuizResult({
      memecoin_match: topMemecoin,
      scores,
      animal_restriction: animalRestriction,
      blockchain_restriction: blockchainRestriction,
    });

    if (success) {
      spawnConfetti();
      setCurrentStep("result");
      
      toast({
        title: "Quiz Complete! 🎉",
        description: `You are ${topMemecoin}! Results saved to the blockchain.`,
      });
    } else {
      toast({
        title: "Quiz Complete! 🎉",
        description: `You are ${topMemecoin}! (Note: Results not saved due to database error)`,
        variant: "destructive",
      });
      setCurrentStep("result");
    }
  };

  const handleWalletConnect = (walletAddress: `0x${string}`) => {
    console.log("Wallet connected:", walletAddress);
  };

  const shareOnTwitter = () => {
    const text = `I just found out I'm ${memecoins[finalResult]?.name || finalResult} on Which Memecoin Are You?! Take the quiz to find your memecoin match! 🎉 ${window.location.origin}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnWarpcast = () => {
    const text = `I just found out I'm ${memecoins[finalResult]?.name || finalResult} on Which Memecoin Are You?! 🎉 ${window.location.origin}`;
    window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, '_blank');
  };

  const resetQuiz = () => {
    setCurrentStep("filters");
    setQuizScores({});
    setFinalResult("");
    setAnimalRestriction(null);
    setBlockchainRestriction(null);
  };

  // Chart data for personal results
  const chartData = {
    labels: Object.keys(quizScores),
    datasets: [
      {
        label: "Your Scores",
        data: Object.values(quizScores),
        backgroundColor: [
          "rgba(167, 139, 250, 0.8)",
          "rgba(34, 211, 238, 0.8)",
          "rgba(244, 114, 182, 0.8)",
          "rgba(96, 165, 250, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(52, 211, 153, 0.8)",
          "rgba(248, 113, 113, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(45, 212, 191, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top" as const,
        labels: {
          color: 'hsl(var(--foreground))',
        }
      },
      title: { 
        display: true, 
        text: "Your Memecoin Compatibility Scores",
        color: 'hsl(var(--foreground))',
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
        }
      },
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        }
      }
    },
  };

  return (
    <div className="min-h-screen p-4 hero-gradient">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 memecoin-gradient bg-clip-text text-transparent">
            Which Memecoin Are You?
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover your memecoin personality through our interactive quiz
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2">
                <FaGlobe className="w-4 h-4" />
                Global Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Wallet Connection */}
        <WalletConnection onConnect={handleWalletConnect} showCard={false} />

        {/* Main Content */}
        <div className="space-y-8">
          {currentStep === "filters" && (
            <div className="space-y-6">
              <Filters
                animalRestriction={animalRestriction}
                blockchainRestriction={blockchainRestriction}
                onAnimalChange={setAnimalRestriction}
                onBlockchainChange={setBlockchainRestriction}
              />
              
              <div className="text-center">
                <Button 
                  onClick={handleFiltersComplete}
                  className="btn-memecoin"
                  size="lg"
                >
                  <FaRocket className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </div>
          )}

          {currentStep === "quiz" && (
            <Quiz
              onComplete={handleQuizComplete}
              animalRestriction={animalRestriction}
              blockchainRestriction={blockchainRestriction}
            />
          )}

          {currentStep === "result" && finalResult && (
            <div className="space-y-8">
              {/* Result Card */}
              <Card className="card-quiz text-center glow-effect">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">
                    You are {memecoins[finalResult]?.name || finalResult}!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <img 
                    src={memecoins[finalResult]?.image} 
                    alt={memecoins[finalResult]?.name || finalResult}
                    className="w-32 h-32 mx-auto rounded-full shadow-lg"
                  />
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    {memecoins[finalResult]?.description || "A unique memecoin personality!"}
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <Button onClick={shareOnTwitter} className="btn-quiz">
                      Share on Twitter
                    </Button>
                    <Button onClick={shareOnWarpcast} className="btn-quiz">
                      Share on Warpcast
                    </Button>
                  </div>
                  
                  <Button onClick={resetQuiz} variant="outline">
                    Take Quiz Again
                  </Button>
                </CardContent>
              </Card>

              {/* Personal Chart */}
              {Object.keys(quizScores).length > 0 && (
                <Card className="card-quiz">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaChartBar className="w-5 h-5" />
                      Your Results Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Donation Form */}
          {address && (
            <DonationForm userAddress={address} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a href="https://base.org" className="text-accent hover:underline">Base</a>,{" "}
            <a href="https://supabase.com" className="text-accent hover:underline">Supabase</a>,{" "}
            and{" "}
            <a href="https://github.com" className="text-accent hover:underline">open source</a>
          </p>
        </footer>

        {/* Confetti Container */}
        <div id="confetti-root" className="fixed inset-0 pointer-events-none z-50" />
      </div>
    </div>
  );
};

export default Index;
