import { Root } from "react-dom/client";

declare global {
  interface Window {
    ZebecCard: { root: Root | null; init: (props: ConfigContextType) => void };
  }
}
interface IInit {
  name: string;
}
export interface StepProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export type IconComponentProps = {
  className?: string;
};

export interface StepContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
export interface ConfigContextType {
  // dbHost: string;
  // rpcNetwork: string;
  rpcUrl: string;
  slippagePercent: number;
  children?: ReactNode;
}

export interface FormProps {
  receiver: string;
  country: string;
  productId: number | string;
  currency: string;
  amount: string;
  token?: any;
  tokenAmount?: string;
  connectedWallet?: string;
  maxValMinVal: {
    maxVal: number;
    minVal: number;
  };
  transactionHash?: string;
  voucherUrl?: string;
  available?: boolean;
}
export interface FormContextType {
  formValues: FormProps;
  setFormValues: React.Dispatch<React.SetStateAction<FormProps>>;
}
export type TokenProps = {
  chain_id: string;
  coingeco_id: string;
  decimal: number;
  icon: string;
  mint: string;
  name: string;
  network: string;
  symbol: string;
  token_type: string;
};
