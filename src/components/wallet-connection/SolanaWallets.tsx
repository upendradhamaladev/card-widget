import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppDispatch } from "../../hooks";
import { Button } from "../../shared/Button";
import { toast } from "../../features/toasts/toastsSlice";
import React, { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

const SolanaWallets: FC = () => {
  const { wallet, wallets, select, connect } = useWallet();
  const dispatch = useAppDispatch();
  const [triggerConnectWallet, setTriggerConnectWallet] =
    useState<boolean>(false);

  const connectWallet = async () => {
    try {
      if (isMobile) {
        window.location.href =
          `${process.env.REACT_APP_PHANTOM_DEEPLINK}` || "";
        return null;
      } else {
        await connect();
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error.message ?? "User rejected the request.",
        })
      );
    }
  };
  useEffect(() => {
    if (wallet && triggerConnectWallet) {
      connectWallet();
      setTriggerConnectWallet(false);
    }
  }, [wallet, triggerConnectWallet]);

  // Solana Wallet Connect
  const onConnectSolanaWallet = async (walletName: WalletName) => {
    try {
      select(walletName);
      setTriggerConnectWallet(true);
    } catch (err: any) {
      if (err.code === 4001) {
        dispatch(
          toast.error({
            message: "User rejected the request.",
          })
        );
      } else {
        dispatch(
          toast.error({
            message: err.message ?? "User rejected the request.",
          })
        );
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-3">
        {wallets.map((wallet, index) => {
          if (wallet.readyState === "Installed")
            return (
              <Button
                key={index}
                onClick={() => {
                  onConnectSolanaWallet(wallet.adapter.name);
                }}
                className="w-full px-4 py-2.5 flex justify-center items-center"
                size="medium"
                variant="link"
              >
                <img src={wallet.adapter.icon} alt="" className="w-4 h-4" />
                <span className="weight-600 mx-2">{wallet.adapter.name}</span>
              </Button>
            );
          else return null;
        })}

        {wallets.filter((data) => data.readyState === "Installed").length ===
        0 ? (
          <Button
            onClick={() => {
              connectWallet();
            }}
            className="w-full px-4 py-2.5 flex justify-center items-center"
            size="medium"
            variant="link"
          >
            <img
              src={
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPgo="
              }
              alt=""
              className="w-4 h-4"
            />
            <span className="weight-600 mx-2">Phantom</span>
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default SolanaWallets;
