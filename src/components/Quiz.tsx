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
}

const questions: QuizQuestion[] = [
  {
    question: "What's your crypto vibe?",
    options: [
      { text: "HODL forever", points: { Dogecoin: 1, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Day trading every hour", points: { Dogecoin: 0, ShibaInu: 1, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Just memes and fun", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 1, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Only in for fair and transparent launches", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 1, Fartcoin: 0 } },
    ]
  },
  {
    question: "Choose your spirit animal:",
    options: [
      { text: "Dog", points: { Dogecoin: 1, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Frog", points: { Dogecoin: 0, ShibaInu: 1, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Cat", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 1, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Something chaotic and undefined", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 1, Turbo: 0, DOG: 0, Fartcoin: 0 } },
    ]
  },
  {
    question: "What's your risk appetite?",
    options: [
      { text: "All in, no regrets", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 1, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Small bets only", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 1, DOG: 0, Fartcoin: 0 } },
      { text: "I follow the community's lead", points: { Dogecoin: 0, ShibaInu: 1, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "I only trust fair launches", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 1, Fartcoin: 0 } },
    ]
  },
  {
    question: "What's your ideal crypto project trait?",
    options: [
      { text: "Strong meme power", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 1, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Huge community", points: { Dogecoin: 0, ShibaInu: 1, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Political spice", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 1, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "No central control", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 1, Fartcoin: 0 } },
    ]
  },
  {
    question: "Which platform do you enjoy the most?",
    options: [
      { text: "Ethereum", points: { Dogecoin: 1, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Solana", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 1, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Bitcoin", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 1, Fartcoin: 0 } },
      { text: "Any chain, as long as it's fun", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 1 } },
    ]
  },
  {
    question: "If your coin had a superpower, it would be:",
    options: [
      { text: "Make people laugh", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 1 } },
      { text: "Unite people worldwide", points: { Dogecoin: 0, ShibaInu: 1, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Go viral instantly", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 1, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0 } },
      { text: "Stay fair and unstoppable", points: { Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, MogCoin: 0, Turbo: 0, DOG: 1, Fartcoin: 0 } },
    ]
  }
];

export default function Quiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    Dogecoin: 0, ShibaInu: 0, Pepe: 0, TrumpCoin: 0, dogwifhat: 0, 
    MogCoin: 0, Turbo: 0, DOG: 0, Fartcoin: 0
  });
  const { toast } = useToast();

  const handleAnswer = (points: { [key: string]: number }) => {
    setScores(prev => {
      const newScores = { ...prev };
      
      Object.entries(points).forEach(([coin, pointValue]) => {
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
              className="p-6 h-auto text-left justify-start hover:scale-105 transition-all duration-300 border-2 hover:border-accent hover:bg-accent/10 whitespace-normal min-h-[60px]"
            >
              <span className="text-base font-medium break-words w-full">{option.text}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}