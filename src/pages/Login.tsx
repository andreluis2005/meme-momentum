import WalletConnection from "@/components/WalletConnection";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      navigate("/");
    }
  }, [address, navigate]);

  const handleConnect = (userAddress: string) => {
    console.log("Wallet connected:", userAddress);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <WalletConnection onConnect={handleConnect} showCard={true} />
      </div>
    </div>
  );
}