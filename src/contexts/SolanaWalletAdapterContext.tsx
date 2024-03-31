import React, { FC, ReactNode, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import Cookies from "js-cookie";
import { isMobile } from "react-device-detect";

export const SolanaWalletAdapterProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const network =
    process.env.REACT_APP_RPC_NETWORK === "mainnet"
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(
    () =>
      process.env.REACT_APP_RPC_NETWORK === "mainnet" &&
      process.env.REACT_APP_SYNDICA_API
        ? process.env.REACT_APP_SYNDICA_API
        : clusterApiUrl(network),
    [network]
  );

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  const auto_connect = useMemo(() => {
    if (isMobile) {
      return true;
    } else {
      const chain: string | undefined = Cookies.get("chain");
      return chain && chain === "solana" ? true : false;
    }
  }, [isMobile]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={auto_connect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
