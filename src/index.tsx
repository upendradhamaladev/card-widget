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

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SolanaWalletAdapterProvider>
        {/* <WagmiProvider> */}
        <StepProvider>
          <FormProvider>
            <App />
            <ConnectWallet />
            <SignTransaction />
            <Toasts />
          </FormProvider>
        </StepProvider>
        {/* </WagmiProvider> */}
      </SolanaWalletAdapterProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
