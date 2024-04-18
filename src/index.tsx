import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import App from "./App";
import { SolanaWalletAdapterProvider } from "./contexts/SolanaWalletAdapterContext";
import { store } from "./store";
import { Provider } from "react-redux";
import ConnectWallet from "./components/wallet-connection/ConnectWallet";
import SignTransaction from "./components/SignTransaction";
import { StepProvider } from "./contexts/StepContext";
import { FormProvider } from "./contexts/FormContext";
import { Toasts } from "./shared/toasts";
import { ConfigContextType, IInit } from "./types";
import { ConfigProvider } from "./contexts/ConfigContext";

window.Buffer = window.Buffer || require("buffer").Buffer;
const root = ReactDOM.createRoot(
  document.getElementById("zebec-card-terminal") as HTMLElement
);
if (!root) {
  throw new Error("Root element not found");
}

// window.ZebecCard.root = root;

export const init = (props: ConfigContextType) => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <SolanaWalletAdapterProvider>
          <StepProvider>
            <FormProvider>
              <ConfigProvider {...props}>
                <App />
                <ConnectWallet />
                <SignTransaction />
                <Toasts />
              </ConfigProvider>
            </FormProvider>
          </StepProvider>
        </SolanaWalletAdapterProvider>
      </Provider>
    </React.StrictMode>
  );
};

// Ensure window.ZebecCard is initialized before setting properties
window.ZebecCard = window.ZebecCard || {};
window.ZebecCard.root = root;

// You can now call init after ZebecCard is properly initialized
window.ZebecCard.init = init;

// Call init with props
// window.ZebecCard.init({
//   // dbHost: "https://api.dev.card.zebec.io",
//   // rpcNetwork: "test",
//   rpcUrl:
//     "https://hidden-misty-reel.solana-mainnet.quiknode.pro/16534ca2fd87e9a1c928b17a4dcd7a1389d47784/",
//   slippagePercent: 1,
// });
