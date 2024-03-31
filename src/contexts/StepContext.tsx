import React, { ReactNode, createContext, useState } from "react";
import { StepContextType } from "../types";

export const StepContext = createContext<StepContextType | undefined>(
  undefined
);
export const StepProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState<number>(1);

  return (
    <StepContext.Provider value={{ step, setStep }}>
      {children}
    </StepContext.Provider>
  );
};
