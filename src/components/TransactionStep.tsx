import React, { FC, useEffect, useMemo, useState } from "react";
import { WalletImage, ZebecCardLeft, ZebecCardRight } from "../assets";
import { Button } from "../shared/Button";
import { useForm } from "react-hook-form";
import {
  CustomInputField,
  CustomTokensDropDownSelect,
} from "../shared/inputs/CustomInputForm";
import { useAppDispatch, useFormHook, useStep } from "../hooks";
import {
  setWalletModal,
  showTransactionProcessingModal,
} from "../features/profileSlice";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppSelector } from "../hooks";
import { toSubstring } from "../utils/toSubstring";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
  DepositParams,
  GetQuoteInfoParams,
  SwapAndDepositParams,
  ZebecCardInstructions,
  ZebecCardProgramFactory,
  ZebecCardService,
  getAnchorProvider,
} from "zebec-instant-card-sdk";
import socket from "../lib/websocket.service";
import { TokenProps } from "../types";
import { toast } from "../features/toasts/toastsSlice";
export type FormValue = {
  receiver: string;
  country: string;
  amount: string;
  productId: number | string;
  currency: string;
  connectedWallet?: string;
  token: string;
  tokenAmount: string;
};
const TransactionStep = () => {
  const usdcAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  const { isSigned } = useAppSelector((state) => state.common);
  // window.Buffer = buffer.Buffer;
  const { setFormValues, formValues } = useFormHook();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { step, setStep } = useStep();
  useEffect(() => {
    if (socket) {
      socket.emit("listTokens");
    }
  }, [socket, step]);
  const [tokens, setTokens] = useState<TokenProps[]>([]);
  useEffect(() => {
    const listTokens = (message: any) => {
      setTokens(message);
    };

    socket.on("listTokens", listTokens);

    return () => {
      socket.off("listTokens", listTokens);
    };
  }, []);
  const { publicKey, connected: solanaConnected } = useWallet();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    getValues,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormValue>();
  const getvalue = (name: any) => {
    return getValues(name);
  };

  const wallet = useWallet(); // Note: only in frontend. Use `Wallet` from anchor to create wallet instance for backends.
  // let service: ZebecCardService;
  const [service, setService] = useState<ZebecCardService | null>(null);
  const initializeSdk = () => {
    let serviceTemp: ZebecCardService;
    const connection = new Connection(
      process.env.REACT_APP_RPC_URL || clusterApiUrl("mainnet-beta")
    );
    const provider = getAnchorProvider(connection, wallet as any, {});
    const program = ZebecCardProgramFactory.getProgram(provider);
    const instructions = new ZebecCardInstructions(program);

    serviceTemp = new ZebecCardService(
      instructions,
      connection,
      wallet.signTransaction
    );
    setService(serviceTemp);
  };
  useEffect(() => {
    // if (buffer.Buffer)
    if (wallet) {
      initializeSdk();
    }
  }, [wallet]);
  const amountValidator = useMemo(() => {
    {
      return {
        required: {
          value: true,
          message: "Amount is required.",
        },
        validate: (value: string) => {
          let amt = value;
          let modifiedAmt = amt.substring(1);
          if (formValues.maxValMinVal) {
            if (
              parseFloat(modifiedAmt) < Number(formValues.maxValMinVal.minVal)
            ) {
              return `Amount must be greater or equal to ${formValues.maxValMinVal.minVal}`;
            }
            if (
              parseFloat(modifiedAmt) > Number(formValues.maxValMinVal.maxVal)
            ) {
              return `Amount must be less than or equal to ${formValues.maxValMinVal.maxVal}`;
            }
          }
          return true; // Return true if validation passes
        },
      };
    }
  }, [formValues?.maxValMinVal]);
  const purchaseCard = (message: any) => {
    if (message) {
      dispatch(
        showTransactionProcessingModal({
          showTransactionProcessingModal: true,
          step: 3,
        })
      );
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("purchaseCard", purchaseCard);
    }
    return () => {
      socket.off("purchaseCard", purchaseCard);
    };
  }, [socket]);
  const orderReceived = (message: any) => {
    // setVisaCardList(message);
    if (message) {
      setFormValues((prev) => {
        return { ...prev, voucherUrl: message.voucherUrl };
      });
      dispatch(
        showTransactionProcessingModal({
          showTransactionProcessingModal: false,
        })
      );
      setStep(4);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("orderReceived", orderReceived);
    }
    return () => {
      socket.off("orderReceived", orderReceived);
    };
  }, [socket]);
  const tokenTypeFinder = (tokenSymbol: string) => {
    const tokenFound = tokens.find(
      (item: TokenProps) => item.symbol === tokenSymbol
    );
    return tokenFound;
  };
  const onSubmit = async (values: FormValue) => {
    setFormValues((prev) => {
      return { ...prev, ...values };
    });
    dispatch(setWalletModal(true));
    // solanaConnected && dispatch(showTransactionProcessingModal(true));

    if (solanaConnected && service) {
      dispatch(
        showTransactionProcessingModal({ showTransactionProcessingModal: true })
      );
      setLoading(true);
      const buyerCounter = await service.getNextBuyerCounter();
      let paramsForOthers: SwapAndDepositParams;
      let paramsForUSDC: DepositParams;

      let onlyAmt = formValues.amount.slice(1);
      let payload: any;

      try {
        if (getvalue("token") === "USDC" || formValues.token === "USDC") {
          paramsForUSDC = {
            buyerAddress: publicKey?.toString() ?? "",
            buyerCounter,
            cardType: formValues.productId.toString(),
            amount: onlyAmt,
            tokenType:
              getvalue("token") &&
              tokenTypeFinder(getvalue("token"))?.token_type
                ? tokenTypeFinder(getvalue("token"))?.token_type
                : formValues.token &&
                  tokenTypeFinder(formValues.token)?.token_type,
            mintAddress: usdcAddress,
          };
          payload = await service.deposit(paramsForUSDC);
        } else {
          // let onlyAmt = formValues.amount.slice(1);

          paramsForOthers = {
            buyerAddress: publicKey?.toString() ?? "",
            buyerCounter,
            cardType: formValues.productId.toString() ?? "",
            inputMintAddress:
              getvalue("token") && tokenTypeFinder(getvalue("token"))?.mint
                ? tokenTypeFinder(getvalue("token"))?.mint
                : formValues.token && tokenTypeFinder(formValues.token)?.mint,
            inputAmount: onlyAmt,
            slippagePercent: process.env.REACT_APP_SLIPPAGE_PERCENT ?? "",
            tokenType: tokenTypeFinder(formValues.token)?.token_type ?? "",
            outputMintAddress: usdcAddress,
          };
          payload = await service.swapAndDeposit(paramsForOthers);
        }

        // hash;
        if (payload) {
          const signature = await payload.execute({ commitment: "finalized" });
          if (signature) {
            dispatch(
              showTransactionProcessingModal({
                showTransactionProcessingModal: true,
                step: 2,
              })
            );
            setFormValues((prev) => {
              return { ...prev, transactionHash: signature };
            });
            socket.emit("purchaseCard", {
              transactionHash: signature,
              buyerCounter: buyerCounter,
              amount: onlyAmt,
              buyerWallet: publicKey?.toString() ?? "",
              cardProductId: formValues.productId,
              token: tokenTypeFinder(formValues.token)?.symbol ?? "",
            });
          }
        }
        setLoading(false);
      } catch (error: any) {
        dispatch(
          showTransactionProcessingModal({
            showTransactionProcessingModal: false,
          })
        );

        console.log("error from wallet", error);
        dispatch(toast.error({ message: error.message }));
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (solanaConnected && publicKey) {
      setValue(
        "connectedWallet",
        solanaConnected
          ? toSubstring(publicKey?.toString(), 10, true) ?? ""
          : ""
      );
    }
  }, [solanaConnected, publicKey]);
  useEffect(() => {
    setValue("token", formValues.token);
    setValue("amount", formValues.amount);
  }, [formValues]);
  const getTokenAmount = async (params: GetQuoteInfoParams) => {
    if (service) {
      try {
        setLoading(true);
        const res: any = await service.getQuoteInfo(params);
        setValue("tokenAmount", res?.inAmount);
        trigger("tokenAmount");
        setLoading(false);

        return res;
      } catch (error: any) {
        console.log("error", error);
        dispatch(toast.error({ message: error.message }));
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (
      getvalue("amount") &&
      service &&
      getvalue("token") &&
      tokens &&
      tokens.length
    ) {
      if (getvalue("token") !== "USDC") {
        let onlyAmt = getvalue("amount").slice(1);

        const params: GetQuoteInfoParams = {
          inputAmount: onlyAmt,
          inputMintAddress: tokenTypeFinder(getvalue("token"))?.mint ?? "",
          slippagePercent: process.env.REACT_APP_SLIPPAGE_PERCENT ?? "",
          outputMintAddress: usdcAddress,
        };
        getTokenAmount(params);
      } else {
        setValue("tokenAmount", getvalue("amount").slice(1));
        // trigger
      }
    }
  }, [watch("amount"), watch("token"), service, tokens]);
  return (
    <>
      {console.log("get is", getvalue("amount"), getvalue("tokenamount"))}
      <div className="landing-step relative step rounded-[4px] w-full max-w-[572px] p-8 bg-zebec-card-background-primary">
        {/* images section */}
        <div className="absolute left-0 -top-[21px] -z-10 flex items-center gap-2">
          <img
            src={ZebecCardLeft}
            alt="Zebec Card Left"
            className="w-[360px]"
          />
        </div>
        <div className="absolute right-0 -top-[21px] -z-10 flex items-center gap-2">
          <img
            src={ZebecCardRight}
            alt="Zebec Card Right"
            className="w-[360px]"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-zebec-card-background-tertiary flex-shrink-0 border-zebec-card-outline border-[0.206px] rounded-[4px] flex items-center justify-center">
            <img
              src={WalletImage}
              className="w-[21px] h-[18px] "
              alt="Wallet"
            />
          </span>
          <span className="text-zebec-card-content-primary text-[28px] leading-8 font-semibold">
            Connect your wallet
          </span>
        </div>
        <p className="mt-3 text-zebec-card-content-tertiary text-sm">
          Make sure to connect the correct wallet. You will not be able to
          change the wallet connected to your account.
        </p>
        <form
          action="
      "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={`mt-8 space-y-2`}>
            <>
              {solanaConnected ? (
                <CustomInputField
                  label={"Connected Wallet"}
                  type={"text"}
                  name={"connectedWallet"}
                  register={register}
                  errors={errors}
                  disable={true}
                  after={true}
                  valueIs={publicKey?.toString()}
                />
              ) : (
                <></>
              )}
              <CustomInputField
                label={`Amount (${formValues.currency})`}
                type={"text"}
                disable={loading}
                name={"amount"}
                validation={amountValidator}
                register={register}
                errors={errors}
                placeholder={"Amount"}
                onChange={(e) => {
                  let currencyToReplace =
                    formValues.currency === "USD" ? "$" : "€";
                  const value = parseFloat(
                    e.target.value.replace(
                      new RegExp(`\\${currencyToReplace}`, "g"),
                      ""
                    )
                  );
                  if (!isNaN(value)) {
                    setValue(
                      "amount",
                      `${formValues.currency === "USD" ? "$" : "€"}${value}`
                    );
                  } else {
                    setValue("amount", "");
                  }
                }}
                after={true}
              />
              <span className="text-xs text-content-secondary ml-3">
                Range {formValues.currency === "USD" ? "$" : "€"}
                {formValues?.maxValMinVal?.minVal} -{" "}
                {formValues.currency === "USD" ? "$" : "€"}
                {formValues?.maxValMinVal?.maxVal}
              </span>
              {/* ) } */}
            </>
            <CustomTokensDropDownSelect
              label={"Token Type"}
              name={"token"}
              register={register}
              setValue={setValue}
              value={getvalue("token") ? getvalue("token") : formValues.token}
              clearErrors={clearErrors}
              errors={errors}
              dropdown={tokens}
              placeholder={"Select Tokens"}
              after={true}
              optionPosition={true}
              disable={loading}
              validation={{
                required: {
                  value: true,
                  message: "Token is required",
                },
              }}
            />
            <CustomInputField
              label={"Token Amount"}
              type={"number"}
              name={"tokenAmount"}
              register={register}
              errors={errors}
              placeholder={"Token Amount"}
              // after={true}
              disable={true}
              symbol={getvalue("token")}
              // validation={{
              //   required: {
              //     value: true,
              //     message: "Token Amount is required",
              //   },
              // }}
            />
          </div>

          <div className="p-4 rounded-lg bg-zebec-card-background-tertiary border-[#75757540]/[0.25] border mt-3">
            {getvalue("amount") && getvalue("tokenAmount") ? (
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs !leading-[14px] font-medium text-zebec-card-content-primary">
                  Rate
                </span>

                <span className="text-xs !leading-[14px] font-medium text-zebec-card-primary-dark">
                  1 {getvalue("token")} ≈{" "}
                  {`${(
                    getvalue("amount").slice(1) /
                    (getvalue("tokenAmount") || formValues.tokenAmount)
                  ).toFixed(8)}`}{" "}
                  USDC
                </span>
              </div>
            ) : (
              <></>
            )}
            <div className="flex items-center justify-between ">
              <span className="text-xs !leading-[14px] font-medium text-zebec-card-content-primary">
                Transaction Fee
              </span>
              <span className="text-xs !leading-[14px] font-medium text-zebec-card-content-primary">
                {process.env.REACT_APP_SLIPPAGE_PERCENT ?? "0"}%
              </span>
            </div>
          </div>
          <Button
            title={`${solanaConnected ? "Buy Gift Card" : "Connect Wallet"} `}
            className="w-full mt-6"
            // onClick={onSubmit}
            type="submit"
            loading={loading}
            disabled={loading}
          />
        </form>
        <Button
          variant="secondary"
          title="Back"
          onClick={() => setStep(2)}
          className="w-full mt-3"
          disabled={loading}
        />
      </div>
    </>
  );
};

export default TransactionStep;
