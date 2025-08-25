"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { walletConnect, injected, coinbaseWallet } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({ target: "metaMask" }),
    walletConnect({
      projectId: "7dfe94d41de1c06a7b02e621eab53009",
      showQrModal: true,
      metadata: {
        name: "Which Memecoin Are You?",
        description: "Quiz to find your memecoin match",
        url: typeof window !== 'undefined' ? window.location.origin : "https://localhost:3000",
        icons: ["/favicon.ico"],
      },
    }),
    coinbaseWallet({ appName: "Which Memecoin Are You?" }),
  ],
  transports: { [base.id]: http("https://mainnet.base.org") },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}