import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { CheckIcon, WalletIcon } from "../../assets/icons";
import { Modal } from "../../shared/Modal";
import { toast } from "../../features/toasts/toastsSlice";
import { toSubstring } from "../../utils/toSubstring";
import SolanaWallets from "./SolanaWallets";
import { changeSignState } from "../../features/commonSlice";
import { useWallet } from "@solana/wallet-adapter-react";
import { setWalletModal } from "../../features/profileSlice";
import { isMobile } from "react-device-detect";
import { Button } from "../../shared/Button";
import React from "react";

const wallets = [
  {
    title: "Solana",
    component: <SolanaWallets />,
  },
];

const ConnectWallet: FC = (props) => {
  const { session_expiry, walletModal } = useAppSelector(
    (state: any) => state.profile
  );
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [signLoading, setSignLoading] = useState<boolean>(false);
  const { isSigned } = useAppSelector((state: any) => state.common);
  const dispatch = useAppDispatch();

  const {
    publicKey,
    connected: solanaConnected,
    disconnect: solanaDisconnect,
    signMessage: solanaSignMessage,
  } = useWallet();

  const [activeWalletSelectTabIndex, setActiveWalletSelectTabIndex] =
    useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isSigned) {
      setSignLoading(false);
    }
    // eslint-disable-next-line
  }, [isSigned]);

  const handleSignMessage = async () => {
    if (solanaConnected && solanaSignMessage) {
      try {
        const encodedMessage = new TextEncoder().encode(
          "Please sign this message to verify your wallet."
        );
        await solanaSignMessage(encodedMessage);
        dispatch(changeSignState({ isSigned: true, connectedChain: "solana" }));
        setSignLoading(false);
      } catch (error: any) {
        console.log(error);
        dispatch(
          toast.error({
            message: error.message ?? "User rejected the request.",
          })
        );
        setSignLoading(false);
      }
    }
  };

  useEffect(() => {
    handleSignMessage();
  }, [solanaConnected]);

  useEffect(() => {
    if (window && isMobile) {
      dispatch(setWalletModal(true));
    }
  }, [isMobile]);

  return (
    <Modal
      show={!isSigned && isInitialized && !session_expiry && walletModal}
      toggleModal={() => dispatch(setWalletModal(false))}
      className="bg-white px-10 py-16 sm:w-[440px]"
      hasCloseIcon={true}
    >
      <div className="text-center text-zebec-card-content-primary text-2xl text-[28px] font-semibold mb-3">
        {!solanaConnected ? "Connect Wallet" : "Sign Message to Continue"}
      </div>
      <div className="text-zebec-card-content-secondary text-center text-sm mb-10">
        Choose one of the available wallet providers.
      </div>

      {!solanaConnected ? (
        <>{wallets[activeWalletSelectTabIndex].component}</>
      ) : (
        <>
          <div>
            <div className="flex space-x-2 items-center">
              <div className="shrink-0 flex w-6 h-6 items-center justify-center rounded-full bg-zebec-card-primary">
                <img src={CheckIcon} className="w-5 h-5 flex-shrink-0" />
              </div>
              <div className="flex  flex-col">
                <span className="text-base text-[14px] text-zebec-card-content-primary font-medium">
                  Connected Wallet
                </span>
                <div className="connected-id flex items-center gap-x-1 bg-zebec-card-brand-gray rounded-[4px] py-[2px] px-2 text-zebec-card-content-secondary text-xs">
                  <img src={WalletIcon} />{" "}
                  <span>
                    {solanaConnected
                      ? toSubstring(publicKey?.toString(), 10, true)
                      : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="line w-[1px] h-12 bg-zebec-card-outline ml-2.5 mb-2"></div>
            <div className="flex space-x-2  items-center">
              <div
                className={`shrink-0 flex w-6 h-6 items-center justify-center rounded-full  self-start ${
                  isSigned
                    ? "bg-zebec-card-primary"
                    : "bg-zebec-card-background-tertiary"
                } `}
              >
                <span
                  className={`text-sm ${
                    isSigned
                      ? "text-white"
                      : "text-zebec-card-content-secondary"
                  }`}
                >
                  2
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-base text-[14px] text-zebec-card-content-primary font-medium">
                  Sign Message
                </span>
                <div className="connected-id flex items-center gap-x-1 rounded-[4px] py-[2px] text-zebec-card-content-secondary text-xs mb-10">
                  <span>
                    Message signed by your wallet only serves for ownership
                    verification
                  </span>
                </div>
              </div>
            </div>
            <div className="wallets flex items-center justify-center gap-y-3 flex-col">
              <Button
                onClick={() => {
                  setSignLoading(true);
                  handleSignMessage();
                }}
                title="Sign Message"
                className="w-full"
                loading={signLoading}
              />
              <Button
                title="Disconnect Wallet"
                className="w-full flex justify-center items-center"
                variant="link"
                onClick={() => {
                  solanaConnected
                    ? solanaDisconnect()
                    : console.log("do nothing");
                  // dispatch(clearWalletBalances())
                }}
              />
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConnectWallet;
