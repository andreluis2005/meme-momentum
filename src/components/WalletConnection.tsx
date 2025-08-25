"use client";

import { useCallback, useState, useEffect } from "react";
import { useConnect, useDisconnect, useAccount, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { FaWallet, FaPlug, FaBitcoin, FaCoins } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Connector } from "wagmi";

export default function WalletConnection({ 
  onConnect, 
  showCard = true 
}: { 
  onConnect: (address: `0x${string}`) => void; 
  showCard?: boolean;
}) {
  const { address, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [clientAddress, setClientAddress] = useState<string | undefined>();

  useEffect(() => {
    if (address) {
      setClientAddress(address);
      onConnect(address);
      if (chainId !== base.id) {
        try {
          switchChain({ chainId: base.id });
        } catch (err) {
          console.error("Failed to switch to Base Mainnet:", err instanceof Error ? err.message : "Unknown error");
        }
      }
    } else {
      setClientAddress(undefined);
    }
  }, [address, chainId, onConnect, switchChain]);

  const uniqueConnectors = connectors.reduce((acc: Connector[], current) => {
    if (current.name.toLowerCase().includes("walletconnect")) return acc;
    if (current.rdns === "io.metamask" && acc.some(c => c.rdns === "io.metamask")) return acc;
    return [...acc, current];
  }, []);

  const handleConnect = useCallback((connector: Connector) => {
    connect({ connector });
    setIsWalletMenuOpen(false);
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setClientAddress(undefined);
  }, [disconnect]);

  if (!clientAddress) {
    const connectButton = (
      <div className="relative">
        <Button
          onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
          className="btn-memecoin"
          size="lg"
        >
          <FaWallet className="w-5 h-5 mr-2" />
          Connect Wallet
        </Button>
        
        {isWalletMenuOpen && (
          <Card className="absolute mt-2 w-64 z-50 card-glow">
            <CardContent className="p-4">
              <ul className="space-y-2">
                {uniqueConnectors.map((connector) => (
                  <li key={connector.id}>
                    <Button
                      onClick={() => handleConnect(connector)}
                      disabled={isConnecting}
                      variant="ghost"
                      className="w-full justify-start text-left"
                    >
                      {connector.name.toLowerCase().includes("metamask") ? 
                        <FaBitcoin className="w-5 h-5 mr-3" /> : 
                        <FaCoins className="w-5 h-5 mr-3" />
                      }
                      {connector.name}
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setIsWalletMenuOpen(false)}
                variant="outline"
                className="w-full mt-4"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );

    if (!showCard) return connectButton;

    return (
      <Card className="card-quiz w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <FaWallet className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Connect your wallet to start the memecoin quiz and save your results!</p>
          </div>
          {connectButton}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-quiz w-full max-w-2xl mx-auto mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <FaWallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium">
                {`${clientAddress.slice(0, 6)}...${clientAddress.slice(-4)}`}
              </p>
              <p className="text-sm text-muted-foreground">Chain ID: {chainId}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {chainId !== base.id && (
              <Button
                onClick={() => switchChain({ chainId: base.id })}
                variant="destructive"
                size="sm"
              >
                Switch to Base
              </Button>
            )}
            <Button
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
            >
              <FaPlug className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}