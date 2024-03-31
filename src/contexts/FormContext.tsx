import React, { ReactNode, createContext, useState } from "react";
import { FormContextType, FormProps } from "../types";

export const FormContext = createContext<FormContextType | undefined>(
  undefined
);
export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formValues, setFormValues] = useState<FormProps>({
    receiver: "",
    country: "",
    productId: "",
    currency: "",
    amount: "",
    token: null,
    tokenAmount: "",
    connectedWallet: "",
    maxValMinVal: {
      maxVal: 0,
      minVal: 0,
    },
  });
  return (
    <FormContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </FormContext.Provider>
  );
};
