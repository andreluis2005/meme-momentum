import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

import WalletConnection from "@/components/WalletConnection";
import Quiz from "@/components/Quiz";
import DonationForm from "@/components/DonationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz } from "@/hooks/useQuiz";
import { FaChartBar, FaGlobe, FaRocket, FaGem } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import dogBitcoinImage from "@/assets/dog-bitcoin.png";

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
  
  const [currentStep, setCurrentStep] = useState<"quiz" | "result">("quiz");
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

  const handleQuizComplete = async (scores: { [key: string]: number }) => {
    setQuizScores(scores);
    const topMemecoin = getTopMemecoin(scores);
    setFinalResult(topMemecoin);

    // Save to database
    const success = await saveQuizResult({
      memecoin_match: topMemecoin,
      scores,
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
    setCurrentStep("quiz");
    setQuizScores({});
    setFinalResult("");
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
    <div className="min-h-screen p-4 hero-gradient relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-8">
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 memecoin-gradient bg-clip-text text-transparent animate-pulse">
              Which Memecoin Are You?
            </h1>
            <div className="h-2 w-full memecoin-gradient rounded-full glow-effect"></div>
            <Sparkles className="absolute -top-4 -right-4 text-primary text-3xl animate-float" />
            <FaGem className="absolute -bottom-2 -left-2 text-accent text-2xl animate-float" style={{animationDelay: '1s'}} />
          </div>
          
          <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Discover your <span className="text-primary font-bold">memecoin personality</span> through our interactive quiz and join <span className="text-accent font-bold">thousands of others</span>!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <Link to="/dashboard">
              <Button variant="outline" className="gap-3 hover-scale border-primary/30 hover:border-primary/70 bg-card/50 backdrop-blur-sm text-lg px-8 py-4">
                <FaGlobe className="w-5 h-5" />
                View Global Analytics
              </Button>
            </Link>
            <Button variant="outline" className="gap-3 hover-scale border-accent/30 hover:border-accent/70 bg-card/50 backdrop-blur-sm text-lg px-8 py-4">
              <FaChartBar className="w-5 h-5" />
              {address ? '✅ Wallet Connected' : '🔗 Connect Wallet to Start'}
            </Button>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-2xl">
            <WalletConnection onConnect={handleWalletConnect} showCard={false} />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {currentStep === "quiz" && (
            <div className="relative">
              <Quiz onComplete={handleQuizComplete} />
            </div>
          )}

          {currentStep === "result" && finalResult && (
            <div className="space-y-12">
              {/* Enhanced Result Card */}
              <Card className="card-quiz text-center glow-effect relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-4">
                    <Sparkles className="text-primary animate-pulse" />
                    You are {memecoins[finalResult]?.name || finalResult}!
                    <Sparkles className="text-accent animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 relative z-10">
                  <div className="relative inline-block">
                    <img 
                      src={memecoins[finalResult]?.image} 
                      alt={memecoins[finalResult]?.name || finalResult}
                      className="w-40 h-40 mx-auto rounded-full shadow-2xl border-4 border-primary/30 glow-effect"
                    />
                    <div className="absolute -inset-4 bg-primary/20 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Special DOG image */}
                  {finalResult === "DOG" && (
                    <div className="mt-6">
                      <img 
                        src={dogBitcoinImage} 
                        alt="DOG with Bitcoin hoodie"
                        className="w-48 h-48 mx-auto rounded-2xl shadow-2xl border-4 border-primary/30 glow-effect"
                      />
                    </div>
                  )}
                  
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-md mx-auto leading-relaxed font-medium">
                    {memecoins[finalResult]?.description || "A unique memecoin personality!"}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={shareOnTwitter} className="btn-quiz text-lg px-8 py-4">
                      🐦 Share on Twitter
                    </Button>
                    <Button onClick={shareOnWarpcast} className="btn-quiz text-lg px-8 py-4">
                      🟣 Share on Warpcast
                    </Button>
                  </div>
                  
                  <Button onClick={resetQuiz} variant="outline" className="hover-scale border-primary/30 hover:border-primary/70 text-lg px-8 py-4">
                    🎲 Take Quiz Again
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Personal Chart */}
              {Object.keys(quizScores).length > 0 && (
                <Card className="card-quiz relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 pointer-events-none"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <FaChartBar className="w-6 h-6 text-accent" />
                      Your Results Breakdown
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="h-80 p-4">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Enhanced Donation Form */}
          {address && (
            <div className="mt-16 flex justify-center">
              <div className="w-full max-w-2xl">
                <DonationForm userAddress={address} />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-20 text-center relative flex justify-center">
          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 glow-effect w-full max-w-2xl">
            <p className="text-muted-foreground text-lg">
              Built with ❤️ using{" "}
              <a href="https://base.org" className="text-primary hover:text-primary/80 hover:underline font-semibold">Base</a>,{" "}
              <a href="https://supabase.com" className="text-accent hover:text-accent/80 hover:underline font-semibold">Supabase</a>,{" "}
              and{" "}
              <a href="https://github.com" className="text-primary hover:text-primary/80 hover:underline font-semibold">open source</a>
            </p>
          </div>
        </footer>

        {/* Confetti Container */}
        <div id="confetti-root" className="fixed inset-0 pointer-events-none z-50" />
      </div>
    </div>
  );
};

export default Index;
