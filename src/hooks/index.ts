import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store";
import { ConfigContextType, FormContextType, StepContextType } from "../types";
import { useContext } from "react";
import { StepContext } from "../contexts/StepContext";
import { FormContext } from "../contexts/FormContext";
import { ConfigContext } from "../contexts/ConfigContext";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useStep = (): StepContextType => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStep must be used within a StepProvider");
  }
  return context;
};

export const useFormHook = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a StepProvider");
  }
  return context;
};
export const useConfigHook = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("config context must be used within a StepProvider");
  }
  return context;
};
