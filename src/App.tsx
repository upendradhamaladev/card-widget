import { useEffect } from "react";
import LandingStep from "./components/LandingStep";
import GiftCardForm from "./components/GiftCardForm";
import OrderPlaced from "./components/OrderPlaced";
import OrderDeclined from "./components/OrderDeclined";
import ProblemReport from "./components/ProblemReport";
import TransactionStep from "./components/TransactionStep";
import { useFormHook, useStep } from "./hooks";
import { useAppDispatch } from "./hooks";
import socket, { initializeSocket } from "./lib/websocket.service";
import { toast } from "./features/toasts/toastsSlice";
import { setCountryList } from "./features/commonSlice";

function App() {
  useEffect(() => {
    initializeSocket();
  }, []);
  const dispatch = useAppDispatch();

  const { step, setStep } = useStep();
  const { setFormValues, formValues } = useFormHook();
  useEffect(() => {
    if (socket) {
      socket.emit("listCountries");
      socket.emit("config");
    }
  }, [socket]);

  useEffect(() => {
    const listCountries = (message: any) => {
      dispatch(setCountryList(message?.countries ?? []));
    };

    const errorHandler = (message: any) => {
      console.log("error is this", message);
      setStep(5);
      dispatch(toast.error({ message: message }));
    };
    const configHandler = (message: any) => {
      if (message) {
        setFormValues((prev) => {
          return {
            ...prev,
            available: message.available,
            maxValMinVal: {
              maxVal: message.maximumAmount,
              minVal: message.minimumAmount,
            },
          };
        });
      }
    };
    if (socket) {
      socket.on("listCountries", listCountries);

      socket.on("error", errorHandler);
      socket.on("config", configHandler);
    }

    return () => {
      if (socket) {
        socket.off("listCountries", listCountries);
        socket.off("error", errorHandler);
        socket.off("config", configHandler);
      }
    };
  }, [socket]);

  return (
    <div className="flex items-center  p-5 sm:p-10  justify-center">
      {step === 1 ? (
        <LandingStep />
      ) : step === 2 ? (
        <GiftCardForm />
      ) : step === 3 ? (
        <TransactionStep />
      ) : step === 4 ? (
        <OrderPlaced />
      ) : step === 5 ? (
        <OrderDeclined />
      ) : step === 6 ? (
        <ProblemReport />
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
