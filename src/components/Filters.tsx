"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FiltersProps {
  animalRestriction: string | null;
  blockchainRestriction: string | null;
  onAnimalChange: (animal: string | null) => void;
  onBlockchainChange: (blockchain: string | null) => void;
}

const animals = ["All", "Dog", "Cat", "Frog", "Penguin", "None"];
const blockchains = ["All", "Ethereum", "Solana", "Base"];

export default function Filters({
  animalRestriction,
  blockchainRestriction,
  onAnimalChange,
  onBlockchainChange
}: FiltersProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="card-quiz">
        <CardHeader>
          <CardTitle className="text-lg">Filter by Animal Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {animals.map((animal) => (
              <Button
                key={animal}
                onClick={() => onAnimalChange(animal === "All" ? null : animal)}
                variant={animalRestriction === animal || (animal === "All" && !animalRestriction) ? "default" : "outline"}
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                {animal}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-quiz">
        <CardHeader>
          <CardTitle className="text-lg">Filter by Blockchain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {blockchains.map((blockchain) => (
              <Button
                key={blockchain}
                onClick={() => onBlockchainChange(blockchain === "All" ? null : blockchain)}
                variant={blockchainRestriction === blockchain || (blockchain === "All" && !blockchainRestriction) ? "default" : "outline"}
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                {blockchain}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}