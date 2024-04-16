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
import { initializeSocket } from "./lib/websocket.service";
import { Toasts } from "./shared/toasts";

initializeSocket();
window.Buffer = window.Buffer || require("buffer").Buffer;
const root = ReactDOM.createRoot(
  document.getElementById("zebec-card-terminal") as HTMLElement
);

export const init = (config: any) => {
  console.log("here is this config", config);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <SolanaWalletAdapterProvider>
          <StepProvider>
            <FormProvider>
              <App />
              <ConnectWallet />
              <SignTransaction />
              <Toasts />
            </FormProvider>
          </StepProvider>
        </SolanaWalletAdapterProvider>
      </Provider>
    </React.StrictMode>
  );
};
// init({});
