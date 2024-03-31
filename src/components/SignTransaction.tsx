import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { Modal } from "../shared/Modal";
import { useAppDispatch } from "../hooks";
import WalletIcon from "../assets/icons/other-icons/new-wallet.svg";
import DotLineIcon from "../assets/icons/other-icons/dot-line.svg";
import DebitCardIcon from "../assets/icons/nav-icons/debit-card.svg";
import { showTransactionProcessingModal } from "../features/profileSlice";
import { PendingIcon, SrCardIcon, WalletIconGreen } from "../assets/icons";
const SignTransaction = () => {
  const dispatch = useAppDispatch();
  const { showTransactionProcessing, step: stepTransaction } = useAppSelector(
    (state: any) => state.profile
  );
  const [contentStep, setContentStep] = useState(1);
  useEffect(() => {
    setContentStep(stepTransaction);
  }, [stepTransaction]);

  return (
    <Modal
      show={showTransactionProcessing}
      toggleModal={() =>
        dispatch(
          showTransactionProcessingModal({
            showTransactionProcessingModal: false,
          })
        )
      }
      className="bg-white  sm:max-w-[350px] h-fit p-0"
      //   hasCloseIcon={true}
    >
      <div className="rounded-2xl  w-full px-10 py-16  bg-zebec-card-background-primary">
        <div className="text-center ">
          <div>
            <span className="transaction-loader"></span>
          </div>
          {/* below is dynamic */}

          {/* first step-1 */}
          {contentStep === 1 && (
            <>
              {" "}
              <p className="text-xs text-content-secondary mt-4">
                Waiting for your signature
              </p>
              <h1 className="text-2xl font-semibold text-content-primary mt-1">
                Sign the transaction in your Wallet
              </h1>
            </>
          )}

          {/* second step */}
          {contentStep === 2 && (
            <>
              <div className="flex justify-center items-center gap-1 mt-4">
                <img
                  src={WalletIconGreen}
                  className="w-8 h-8 text-zebec-card-primary"
                  alt="Wallet"
                />
                <img src={DotLineIcon} className="w-9 h-9" alt="Debit Line" />
                <img src={DebitCardIcon} className="w-6 h-6" alt="Debit Card" />
              </div>
              <p className="text-xs text-content-secondary mt-3">
                Transferring fund from your Wallet
              </p>
              <h1 className="text-2xl font-semibold text-content-primary mt-1 -trackiong-[0.18px]">
                Your transaction is being processed. It can take few seconds.
              </h1>
            </>
          )}

          {/* third step */}
          {contentStep === 3 && (
            <>
              {" "}
              <div className="flex justify-center items-center gap-1 mt-4">
                <img
                  src={DebitCardIcon}
                  alt="Wallet"
                  className="w-6 h-6 mr-2"
                />
                <img src={DotLineIcon} alt="Dot Line" className="w-9 h-9" />
                <img
                  src={SrCardIcon}
                  alt="Debit Card"
                  className="w-8 h-8 text-zebec-card-primary"
                />
              </div>
              <h1 className="text-2xl font-semibold text-content-primary mt-1 -trackiong-[0.18px]">
                Your purchase is being made. It can take few seconds.
              </h1>
            </>
          )}

          {/* upto this */}
          <div className="mt-8 flex items-center gap-1 text-xs text-warning justify-center text-zebec-card-warning">
            <img
              src={PendingIcon}
              alt="Pending Icon"
              className="w-4 h-4 flex-shrink-0"
            />
            <span>Please don’t close your window.</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignTransaction;
