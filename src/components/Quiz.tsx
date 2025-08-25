"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  question: string;
  options: {
    text: string;
    points: { [key: string]: number };
  }[];
}

interface QuizProps {
  onComplete: (scores: { [key: string]: number }) => void;
  animalRestriction?: string;
  blockchainRestriction?: string;
}

const questions: QuizQuestion[] = [
  {
    question: "What's your trading style?",
    options: [
      { text: "HODL until moon 🚀", points: { Dogecoin: 3, ShibaInu: 2, DOG: 1 } },
      { text: "Meme it till you make it", points: { Pepe: 3, Fartcoin: 2, MogCoin: 1 } },
      { text: "High energy, fast trades", points: { Turbo: 3, Dogwifhat: 2, Brett: 1 } },
      { text: "Political and chaotic", points: { TrumpCoin: 3, SPX: 2, Bonk: 1 } },
    ]
  },
  {
    question: "What's your ideal vacation destination?",
    options: [
      { text: "Moon resort with luxury amenities", points: { Dogecoin: 3, Toshi: 2, DOG: 1 } },
      { text: "Meme convention in Tokyo", points: { Pepe: 3, MogCoin: 2, Pengu: 1 } },
      { text: "Adventure racing in Monaco", points: { Turbo: 3, Brett: 2, Dogwifhat: 1 } },
      { text: "Political rally in Washington", points: { TrumpCoin: 3, SPX: 2, Fartcoin: 1 } },
    ]
  },
  {
    question: "What's your favorite hobby?",
    options: [
      { text: "Creating viral memes", points: { Pepe: 3, Fartcoin: 2, MogCoin: 1 } },
      { text: "Building crypto portfolios", points: { Dogecoin: 3, ShibaInu: 2, Toshi: 1 } },
      { text: "Speedrunning video games", points: { Turbo: 3, Brett: 2, DOG: 1 } },
      { text: "Debating on social media", points: { TrumpCoin: 3, SPX: 2, Bonk: 1 } },
    ]
  },
  {
    question: "What motivates you the most?",
    options: [
      { text: "Community and loyalty", points: { Dogecoin: 3, ShibaInu: 2, DOG: 1 } },
      { text: "Humor and creativity", points: { Pepe: 3, Fartcoin: 2, Dogwifhat: 1 } },
      { text: "Speed and innovation", points: { Turbo: 3, Brett: 2, Toshi: 1 } },
      { text: "Power and influence", points: { TrumpCoin: 3, SPX: 2, MogCoin: 1 } },
    ]
  },
  {
    question: "What's your communication style?",
    options: [
      { text: "Friendly and supportive", points: { Dogecoin: 3, DOG: 2, Pengu: 1 } },
      { text: "Sarcastic and witty", points: { Pepe: 3, Fartcoin: 2, MogCoin: 1 } },
      { text: "Direct and energetic", points: { Turbo: 3, Brett: 2, Dogwifhat: 1 } },
      { text: "Bold and controversial", points: { TrumpCoin: 3, SPX: 2, Bonk: 1 } },
    ]
  }
];

const memecoinAnimals: { [key: string]: string } = {
  Dogecoin: "Dog",
  ShibaInu: "Dog", 
  DOG: "Dog",
  Dogwifhat: "Dog",
  Bonk: "Dog",
  Pepe: "Frog",
  MogCoin: "Cat",
  Toshi: "Cat",
  Pengu: "Penguin",
  Turbo: "None",
  Brett: "None",
  TrumpCoin: "None",
  SPX: "None",
  Fartcoin: "None"
};

export default function Quiz({ onComplete, animalRestriction, blockchainRestriction }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, Dogwifhat: 0, 
    MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0, Pengu: 0, Bonk: 0, 
    SPX: 0, Toshi: 0, Brett: 0
  });
  const { toast } = useToast();

  const handleAnswer = (points: { [key: string]: number }) => {
    setScores(prev => {
      const newScores = { ...prev };
      
      Object.entries(points).forEach(([coin, pointValue]) => {
        // Apply animal restriction
        if (animalRestriction && animalRestriction !== "All") {
          const coinAnimal = memecoinAnimals[coin];
          if (coinAnimal !== animalRestriction) {
            return; // Skip this coin if it doesn't match the animal filter
          }
        }
        
        newScores[coin] = (newScores[coin] || 0) + pointValue;
      });
      
      return newScores;
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed
      setTimeout(() => {
        onComplete(scores);
        toast({
          title: "Quiz Complete! 🎉",
          description: "Calculating your memecoin match...",
        });
      }, 500);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="card-quiz w-full max-w-2xl mx-auto glow-effect">
      <CardHeader>
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="h-2 rounded-full memecoin-gradient transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <h2 className="text-xl font-semibold text-center text-foreground mb-6">
          {questions[currentQuestion].question}
        </h2>
        
        <div className="grid gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option.points)}
              variant="outline"
              size="lg"
              className="p-6 h-auto text-left justify-start hover:scale-105 transition-all duration-300 border-2 hover:border-accent hover:bg-accent/10"
            >
              <span className="text-base font-medium">{option.text}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}